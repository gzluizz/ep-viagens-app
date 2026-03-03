from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from django.contrib.auth.models import User


# =========================
# DESTINO
# =========================
class Destino(models.Model):
    cidade = models.CharField(max_length=100)
    estado = models.CharField(max_length=100)
    pais = models.CharField(max_length=100)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('cidade', 'estado', 'pais')
        indexes = [
            models.Index(fields=['cidade']),
            models.Index(fields=['estado']),
        ]

    def __str__(self):
        return f"{self.cidade}, {self.estado}, {self.pais}"


# =========================
# HOSPEDAGEM
# =========================
class Hospedagem(models.Model):
    nome = models.CharField(max_length=150)
    endereco = models.CharField(max_length=200)
    telefone = models.CharField(max_length=20)
    email = models.EmailField()

    # PROTECT evita apagar destino com hospedagens vinculadas
    destino = models.ForeignKey(Destino, on_delete=models.PROTECT, related_name="hospedagens")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['nome']),
        ]

    def __str__(self):
        return f"{self.nome} - {self.destino.cidade}"


# =========================
# TRANSPORTE
# =========================
class Transporte(models.Model):
    tipo = models.CharField(max_length=100)
    empresa = models.CharField(max_length=200, blank=True)
    descricao = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.tipo} ({self.empresa})" if self.empresa else self.tipo


# =========================
# VIAJANTE
# =========================
class Viajante(models.Model):
    nome_completo = models.CharField(max_length=200)

    cpf = models.CharField(
        max_length=11,
        unique=True,
        validators=[
            RegexValidator(
                regex=r'^\d{11}$',
                message="CPF deve conter 11 dígitos numéricos."
            )
        ]
    )

    data_nascimento = models.DateField()
    celular = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)

    contato_emergencia_nome = models.CharField(max_length=200, blank=True)
    contato_emergencia_telefone = models.CharField(max_length=20, blank=True)
    observacoes_medicas = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['nome_completo']),
            models.Index(fields=['cpf']),
        ]

    def __str__(self):
        return self.nome_completo


# =========================
# VIAGEM
# =========================
class Viagem(models.Model):

    STATUS_CHOICES = [
        ('planejada', 'Planejada'),
        ('confirmada', 'Confirmada'),
        ('cancelada', 'Cancelada'),
        ('finalizada', 'Finalizada'),
    ]

    titulo = models.CharField(max_length=200)

    # PROTECT evita apagar registros usados em viagem
    destino = models.ForeignKey(Destino, on_delete=models.PROTECT, related_name="viagens")
    hospedagem = models.ForeignKey(Hospedagem, on_delete=models.PROTECT, related_name="viagens")
    transporte = models.ForeignKey(Transporte, on_delete=models.PROTECT, related_name="viagens")

    data_inicio = models.DateField()
    data_fim = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='planejada'
    )

    observacoes = models.TextField(blank=True)
    vagas_disponiveis = models.PositiveIntegerField(default=0)

    created_by = models.ForeignKey(
        User,
        related_name='viagens_criadas',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    viajantes = models.ManyToManyField(
        Viajante,
        through='ViagemViajante',
        related_name="viagens"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['data_inicio']),
            models.Index(fields=['status']),
        ]

    def clean(self):
        # Validação de datas
        if self.data_fim < self.data_inicio:
            raise ValidationError("Data fim não pode ser menor que data início.")

        # Garantir que hospedagem pertence ao mesmo destino
        if self.hospedagem.destino != self.destino:
            raise ValidationError(
                "Destino da viagem deve ser igual ao destino da hospedagem."
            )

    def __str__(self):
        return self.titulo


# =========================
# VIAGEM VIAJANTE (TABELA INTERMEDIÁRIA)
# =========================
class ViagemViajante(models.Model):

    STATUS_PAGAMENTO_CHOICES = [
        ('pendente', 'Pendente'),
        ('parcial', 'Parcial'),
        ('pago', 'Pago'),
    ]

    viagem = models.ForeignKey(Viagem, on_delete=models.CASCADE)
    viajante = models.ForeignKey(Viajante, on_delete=models.CASCADE)

    status_pagamento = models.CharField(
        max_length=20,
        choices=STATUS_PAGAMENTO_CHOICES,
        default='pendente'
    )

    valor_total = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    valor_pago = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('viagem', 'viajante')

    def __str__(self):
        return f"{self.viajante} - {self.viagem}"
from django.db import models


class Destino(models.Model):
    cidade = models.CharField(max_length=100)
    estado = models.CharField(max_length=100)
    pais = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.cidade}, {self.estado}, {self.pais}"


class Hospedagem(models.Model):
    nome = models.CharField(max_length=200)
    endereco = models.CharField(max_length=300)
    cidade = models.CharField(max_length=100)
    estado = models.CharField(max_length=100)
    pais = models.CharField(max_length=100)
    telefone = models.CharField(max_length=50, blank=True)
    email = models.EmailField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nome


class Transporte(models.Model):
    tipo = models.CharField(max_length=100)
    empresa = models.CharField(max_length=200, blank=True)
    descricao = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.tipo} ({self.empresa})" if self.empresa else self.tipo


class Viajante(models.Model):
    nome_completo = models.CharField(max_length=200)
    cpf = models.CharField(max_length=14, unique=True)
    data_nascimento = models.DateField()
    celular = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    contato_emergencia_nome = models.CharField(max_length=200, blank=True)
    contato_emergencia_telefone = models.CharField(max_length=20, blank=True)
    observacoes_medicas = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nome_completo


class Viagem(models.Model):
    titulo = models.CharField(max_length=200)
    destino = models.ForeignKey(Destino, on_delete=models.PROTECT)
    hospedagem = models.ForeignKey(Hospedagem, on_delete=models.PROTECT)
    transporte = models.ForeignKey(Transporte, on_delete=models.PROTECT)
    data_inicio = models.DateField()
    data_fim = models.DateField()
    status = models.CharField(max_length=50, default='planejada')
    observacoes = models.TextField(blank=True)
    created_by = models.ForeignKey(
        'auth.User', related_name='viagens_criadas',
        on_delete=models.SET_NULL, null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    viajantes = models.ManyToManyField(Viajante, through='ViagemViajante')

    def __str__(self):
        return self.titulo


class ViagemViajante(models.Model):
    viagem = models.ForeignKey(Viagem, on_delete=models.CASCADE)
    viajante = models.ForeignKey(Viajante, on_delete=models.CASCADE)
    status_pagamento = models.CharField(max_length=50, default='pendente')
    valor_total = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    valor_pago = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.viajante} - {self.viagem}"

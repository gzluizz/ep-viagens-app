from django.contrib import admin
from .models import (
    Destino,
    Hospedagem,
    Transporte,
    Viajante,
    Viagem,
    ViagemViajante,
)


# =========================
# DESTINO
# =========================
@admin.register(Destino)
class DestinoAdmin(admin.ModelAdmin):
    list_display = ('cidade', 'estado', 'pais')
    search_fields = ('cidade', 'estado', 'pais')
    list_filter = ('estado', 'pais')


# =========================
# HOSPEDAGEM
# =========================
@admin.register(Hospedagem)
class HospedagemAdmin(admin.ModelAdmin):
    list_display = (
        'nome',
        'get_cidade',
        'get_estado',
        'get_pais',
        'telefone',
        'email'
    )
    search_fields = ('nome', 'destino__cidade', 'destino__estado')
    list_filter = ('destino__estado', 'destino__pais')

    def get_cidade(self, obj):
        return obj.destino.cidade
    get_cidade.short_description = "Cidade"

    def get_estado(self, obj):
        return obj.destino.estado
    get_estado.short_description = "Estado"

    def get_pais(self, obj):
        return obj.destino.pais
    get_pais.short_description = "País"


# =========================
# TRANSPORTE
# =========================
@admin.register(Transporte)
class TransporteAdmin(admin.ModelAdmin):
    list_display = ('tipo', 'empresa')
    search_fields = ('tipo', 'empresa')


# =========================
# VIAJANTE
# =========================
@admin.register(Viajante)
class ViajanteAdmin(admin.ModelAdmin):
    list_display = ('nome_completo', 'cpf', 'email')
    search_fields = ('nome_completo', 'cpf', 'email')


# =========================
# VIAGEM
# =========================
@admin.register(Viagem)
class ViagemAdmin(admin.ModelAdmin):
    list_display = (
        'titulo',
        'destino',
        'hospedagem',
        'data_inicio',
        'data_fim',
        'status'
    )
    list_filter = ('status', 'data_inicio')
    search_fields = ('titulo',)


# =========================
# VIAGEM VIAJANTE
# =========================
@admin.register(ViagemViajante)
class ViagemViajanteAdmin(admin.ModelAdmin):
    list_display = (
        'viagem',
        'viajante',
        'status_pagamento',
        'valor_total',
        'valor_pago'
    )
    list_filter = ('status_pagamento',)
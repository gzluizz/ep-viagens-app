from django.contrib import admin
from .models import (
    Destino,
    Hospedagem,
    Transporte,
    Viajante,
    Viagem,
    ViagemViajante,
)


@admin.register(Destino)
class DestinoAdmin(admin.ModelAdmin):
    list_display = ('cidade', 'estado', 'pais')


@admin.register(Hospedagem)
class HospedagemAdmin(admin.ModelAdmin):
    list_display = ('nome', 'cidade', 'pais')


@admin.register(Transporte)
class TransporteAdmin(admin.ModelAdmin):
    list_display = ('tipo', 'empresa')


@admin.register(Viajante)
class ViajanteAdmin(admin.ModelAdmin):
    list_display = ('nome_completo', 'cpf', 'email')


@admin.register(Viagem)
class ViagemAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'destino', 'data_inicio', 'data_fim', 'status')


@admin.register(ViagemViajante)
class ViagemViajanteAdmin(admin.ModelAdmin):
    list_display = ('viagem', 'viajante', 'status_pagamento', 'valor_total', 'valor_pago')

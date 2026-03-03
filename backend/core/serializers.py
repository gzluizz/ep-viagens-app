from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Destino, Hospedagem, Transporte, Viajante, Viagem, ViagemViajante


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
        read_only_fields = ('id',)


class DestinoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destino
        fields = ('id', 'cidade', 'estado', 'pais', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class HospedagemSerializer(serializers.ModelSerializer):
    destino = DestinoSerializer(read_only=True)
    destino_id = serializers.PrimaryKeyRelatedField(
        queryset=Destino.objects.all(),
        write_only=True,
        source='destino'
    )

    class Meta:
        model = Hospedagem
        fields = (
            'id', 'nome', 'endereco', 'destino', 'destino_id',
            'telefone', 'email', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')

class TransporteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transporte
        fields = ('id', 'tipo', 'empresa', 'descricao', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class ViajanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Viajante
        fields = (
            'id', 'nome_completo', 'cpf', 'data_nascimento', 'celular', 'email',
            'contato_emergencia_nome', 'contato_emergencia_telefone', 'observacoes_medicas',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')


class ViagemViajanteSerializer(serializers.ModelSerializer):
    viajante = ViajanteSerializer(read_only=True)
    viajante_id = serializers.PrimaryKeyRelatedField(
        queryset=Viajante.objects.all(),
        write_only=True,
        source='viajante'
    )

    class Meta:
        model = ViagemViajante
        fields = (
            'id', 'viagem', 'viajante', 'viajante_id', 'status_pagamento',
            'valor_total', 'valor_pago', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')


class ViagemSerializer(serializers.ModelSerializer):
    destino = DestinoSerializer(read_only=True)
    destino_id = serializers.PrimaryKeyRelatedField(
        queryset=Destino.objects.all(),
        write_only=True,
        source='destino'
    )
    hospedagem = HospedagemSerializer(read_only=True)
    hospedagem_id = serializers.PrimaryKeyRelatedField(
        queryset=Hospedagem.objects.all(),
        write_only=True,
        source='hospedagem'
    )
    transporte = TransporteSerializer(read_only=True)
    transporte_id = serializers.PrimaryKeyRelatedField(
        queryset=Transporte.objects.all(),
        write_only=True,
        source='transporte'
    )
    viajantes = ViajanteSerializer(many=True, read_only=True)

    class Meta:
        model = Viagem
        fields = (
            'id', 'titulo', 'destino', 'destino_id', 'hospedagem', 'hospedagem_id',
            'transporte', 'transporte_id', 'data_inicio', 'data_fim', 'status',
            'observacoes', 'viajantes', 'created_by', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_by', 'created_at', 'updated_at')

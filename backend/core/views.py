from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from .models import Destino, Hospedagem, Transporte, Viajante, Viagem, ViagemViajante
from .serializers import (
    UserSerializer, DestinoSerializer, HospedagemSerializer,
    TransporteSerializer, ViajanteSerializer, ViagemSerializer, ViagemViajanteSerializer
)


class AuthViewSet(viewsets.ViewSet):
    """ViewSet para autenticação de usuários."""
    
    permission_classes = (AllowAny,)

    @action(detail=False, methods=['post'])
    def login(self, request):
        """
        Login do usuário com username e password.
        Retorna o token de autenticação.
        """
        from django.contrib.auth import authenticate
        from rest_framework.authtoken.models import Token

        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {'error': 'Username e password são obrigatórios'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=username, password=password)
        if user is None:
            return Response(
                {'error': 'Credenciais inválidas'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        })

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        """
        Logout do usuário destruindo o token.
        """
        request.user.auth_token.delete()
        return Response({'message': 'Logout realizado com sucesso'})


class DestinoViewSet(viewsets.ModelViewSet):
    queryset = Destino.objects.all()
    serializer_class = DestinoSerializer
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        self.get_object().delete()
        return Response(
            {'message': 'Destino deletado com sucesso'},
            status=status.HTTP_200_OK
        )


class HospedagemViewSet(viewsets.ModelViewSet):
    queryset = Hospedagem.objects.all()
    serializer_class = HospedagemSerializer
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        self.get_object().delete()
        return Response(
            {'message': 'Hospedagem deletada com sucesso'},
            status=status.HTTP_200_OK
        )


class TransporteViewSet(viewsets.ModelViewSet):
    queryset = Transporte.objects.all()
    serializer_class = TransporteSerializer
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        self.get_object().delete()
        return Response(
            {'message': 'Transporte deletado com sucesso'},
            status=status.HTTP_200_OK
        )


class ViajanteViewSet(viewsets.ModelViewSet):
    queryset = Viajante.objects.all()
    serializer_class = ViajanteSerializer
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        self.get_object().delete()
        return Response(
            {'message': 'Viajante deletado com sucesso'},
            status=status.HTTP_200_OK
        )


class ViagemViewSet(viewsets.ModelViewSet):
    queryset = Viagem.objects.all()
    serializer_class = ViagemSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        """Seta o usuário atual como criador da viagem."""
        serializer.save(created_by=self.request.user)

    def destroy(self, request, *args, **kwargs):
        self.get_object().delete()
        return Response(
            {'message': 'Viagem deletada com sucesso'},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def adicionar_viajante(self, request, pk=None):
        """Adiciona um viajante a uma viagem."""
        viagem = self.get_object()
        viajante_id = request.data.get('viajante_id')
        status_pagamento = request.data.get('status_pagamento', 'pendente')
        valor_total = request.data.get('valor_total')

        try:
            viajante = Viajante.objects.get(id=viajante_id)
        except Viajante.DoesNotExist:
            return Response(
                {'error': 'Viajante não encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )

        viagem_viajante, created = ViagemViajante.objects.get_or_create(
            viagem=viagem,
            viajante=viajante,
            defaults={
                'status_pagamento': status_pagamento,
                'valor_total': valor_total
            }
        )

        if not created:
            return Response(
                {'error': 'Viajante já estava adicionado a esta viagem'},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            ViagemViajanteSerializer(viagem_viajante).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['get'])
    def viajantes(self, request, pk=None):
        """Lista viajantes de uma viagem."""
        viagem = self.get_object()
        viajantes = viagem.viajantes.all()
        serializer = ViajanteSerializer(viajantes, many=True)
        return Response(serializer.data)


class ViagemViajanteViewSet(viewsets.ModelViewSet):
    queryset = ViagemViajante.objects.all()
    serializer_class = ViagemViajanteSerializer
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        self.get_object().delete()
        return Response(
            {'message': 'Relação viagem-viajante deletada com sucesso'},
            status=status.HTTP_200_OK
        )

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AuthViewSet, DestinoViewSet, HospedagemViewSet, TransporteViewSet,
    ViajanteViewSet, ViagemViewSet, ViagemViajanteViewSet
)

router = DefaultRouter()
router.register(r'auth', AuthViewSet, basename='auth')
router.register(r'destinos', DestinoViewSet, basename='destino')
router.register(r'hospedagens', HospedagemViewSet, basename='hospedagem')
router.register(r'transportes', TransporteViewSet, basename='transporte')
router.register(r'viajantes', ViajanteViewSet, basename='viajante')
router.register(r'viagens', ViagemViewSet, basename='viagem')
router.register(r'viagem-viajantes', ViagemViajanteViewSet, basename='viagem-viajante')

urlpatterns = [
    path('', include(router.urls)),
]

from django.urls import path, include
from rest_framework_nested import routers
from .views import CategoryViewSet, ProductViewSet, StationReviewViewSet

# Root router — same routes as before
router = routers.DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'',           ProductViewSet,  basename='product')

# Nested router — reviews live under each product/station
# GET/POST  /api/products/{station_pk}/reviews/
# GET/PATCH/DELETE  /api/products/{station_pk}/reviews/{id}/
products_router = routers.NestedDefaultRouter(router, r'', lookup='station')
products_router.register(r'reviews', StationReviewViewSet, basename='station-reviews')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(products_router.urls)),
]
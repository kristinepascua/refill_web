from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet

# 1. Initialize the router
router = DefaultRouter()

# 2. Register your actual ViewSets
# Use 'categories' for Category and '' (empty) for Products
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'', ProductViewSet, basename='product')

# 3. Define urlpatterns
urlpatterns = [
    path('', include(router.urls)),
]
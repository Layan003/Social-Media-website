from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import signUpView


urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token'),
    path('token/refresh/', TokenObtainPairView.as_view(), name='refresh'),
    path('signup/', signUpView, name='Signup'),

]
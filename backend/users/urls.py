from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import sign_up,get_user_data, profile


urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('signup/', sign_up, name='Signup'),
    path('user/', get_user_data, name='get_user_data'),
    path('profile/', profile, name='profile'),
    path('auth/', include('rest_framework.urls')),
] 
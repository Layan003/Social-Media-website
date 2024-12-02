from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import sign_up,get_user_info, profile, update_profile, follow, get_follower


urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('signup/', sign_up, name='Signup'),
    path('user/', get_user_info, name='get_user_info'),
    path('profile/<int:pk>/', profile, name='profile'),
    path('auth/', include('rest_framework.urls')),
    path('profile/update/', update_profile, name='update_profile'),
    path('get-follow/<int:pk>/', get_follower, name='get_follower'),
    path('follow/<int:pk>/', follow, name='follow'),



] 
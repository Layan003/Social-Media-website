from django.urls import path
from .views import list_posts, like_post, comment, create_post, delete_post, get_user_data

urlpatterns = [
    path('posts/', list_posts, name='list_posts'),
    path('like/', like_post, name='like_post'),
    path('comment/', comment, name='comment'),
    path('post/create/', create_post, name='create_post'),
    path('post/delete/', delete_post, name='delete_post'),
    path('user/<int:pk>/', get_user_data, name='get_user_data'),



]
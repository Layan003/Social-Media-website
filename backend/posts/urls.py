from django.urls import path
from .views import list_posts, like_post, comment, create_post, delete_post, posts,search

urlpatterns = [
    path('posts/', list_posts, name='list_posts'),
    path('like/', like_post, name='like_post'),
    path('comment/', comment, name='comment'),
    path('post/create/', create_post, name='create_post'),
    path('post/delete/', delete_post, name='delete_post'),
    path('user/<int:pk>/posts/', posts, name='posts'),
    path('search/', search, name='search')
]
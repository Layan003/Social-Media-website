from django.urls import path
from .views import list_posts, like_post, comment

urlpatterns = [
    path('posts/', list_posts, name='list_posts'),
    path('like/', like_post, name='like_post'),
    path('comment/', comment, name='comment'),
]
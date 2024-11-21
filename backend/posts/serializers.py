from rest_framework import serializers
from .models import Post, Comment
from users.serializers import ProfileSerializer

class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    profile_img = serializers.ImageField(source='user.profile.profile_img', read_only=True)
    name = serializers.CharField(source='user.profile.name', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'username', 'content', 'created_at', 'post', 'profile_img', 'name']
        extra_kwargs = {
            'created_at': {"read_only": True}
        }


class ListPostSerializer(serializers.ModelSerializer):
    # user_id = serializers.IntegerField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    name = serializers.CharField(source='user.profile.name', read_only=True)
    profile_image = serializers.ImageField(source='user.profile.profile_img', read_only=True)
    profile_id = serializers.IntegerField(source='user.profile.id', read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'user', 'username', 'profile_image', 'profile_id', 'name', 'content', 'post_image', 'likes', 'comments']
        extra_kwargs = {"user": {"read_only": True}}

class PostSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Post
        fields = ['id', 'user', 'post_image', 'content', 'created_at', 'likes']
        extra_kwargs = {
            'created_at': {"read_only": True}
        }
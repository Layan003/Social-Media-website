from rest_framework import serializers
from .models import Post, Comment


class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'content', 'created_at', 'post', 'username']
        extra_kwargs = {
            'created_at': {"read_only": True}
        }


class ListPostSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    name = serializers.CharField(source='user.profile.name', read_only=True)
    profile_image = serializers.ImageField(source='user.profile.profile_img', read_only=True)
    profile_id = serializers.IntegerField(source='user.profile.id', read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'content', 'user', 'post_image', 'likes', 'user_id', 'username', 'name', 'profile_image', 'profile_id', 'comments']
        extra_kwargs = {"user": {"read_only": True}}

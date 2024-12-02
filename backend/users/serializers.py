from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, Follower

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = Profile
        fields = ['profile_img', 'name', 'bio', 'birthday', 'user', 'username']

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password', 'profile']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class FollowerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follower
        fields = ['follower', 'following']

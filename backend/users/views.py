from django.shortcuts import render, get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from .serializers import UserSerializer, ProfileSerializer, FollowerSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .models import Follower

@api_view(["POST"])
@permission_classes([AllowAny])
def sign_up(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token
        return Response({"access": str(access), 'refresh': str(refresh)}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    data = {
        'id': request.user.id,
        'username': request.user.username,
    }

    return Response(data, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile(request, pk):
    try:
        user = get_object_or_404(User, id=pk)
        profile = user.profile
        serializer = ProfileSerializer(profile)
        if serializer:
            print(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"message": "profile is not found"}, status=status.HTTP_404_NOT_FOUND)


    except User.DoesNotExist:
        return Response({"message": "user is not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_profile(request):
    if request.method == "POST":
        name = request.data.get('name')
        profile = request.user.profile

        data = {
            'user': request.user.id,
            'name': name,
            'bio': request.data.get('bio'),
            'birthday': request.data.get('birthday'),
            'profile_img': request.FILES.get('profile_img')
        }

        serializer = ProfileSerializer(profile, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["POST", 'GET'])
@permission_classes([IsAuthenticated])
def follow(request, pk):
    current_user = request.user
    try:
        other_user = User.objects.get(id=pk)
    except User.DoesNotExist:
        return Response({"message": "user doesn't exists"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "POST": 
        follower = Follower.objects.filter(follower=current_user, following=other_user).first()
        if follower:
            follower.delete()
            return Response({"message": "unfollow successfully"}, status=status.HTTP_200_OK)
        else:
            Follower.objects.create(follower=current_user, following=other_user)
            return Response({"message": "follow successfully"}, status=status.HTTP_200_OK)
    if request.method == "GET":
        follower = Follower.objects.filter(follower=current_user, following=other_user).first()
        if follower:
            return Response({"message": "followed"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "not followed"}, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_follower(request, pk):
    try:
        user = User.objects.get(id=pk)
    except User.DoesNotExist:
        return Response({"message": "user not found"}, status=status.HTTP_404_NOT_FOUND)
    
    followers_count = Follower.objects.filter(following=user).count()
    followings_count = Follower.objects.filter(follower=user).count()
    return Response({"followings": followings_count, 'followers': followers_count}, status=status.HTTP_200_OK)
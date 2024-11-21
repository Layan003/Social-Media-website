from django.shortcuts import render, get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializers import ListPostSerializer, CommentSerializer, PostSerializer
from .models import Post
from rest_framework.response import Response
from rest_framework import status

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_posts(request):
    if request.method == "GET":
        posts = Post.objects.all().order_by('-id')
        serializer = ListPostSerializer(posts, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def like_post(request):
    if request.method == "POST":
        post_id = request.data.get('postId')
        post = Post.objects.get(id=post_id)

        if post.likes.filter(id=request.user.id).exists():
            #unlike 
            post.likes.remove(request.user)
        else:
            #like
            post.likes.add(request.user)

        return Response({"message": "like status updated"}, status=status.HTTP_200_OK)
    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def comment(request):
    if request.method == "POST":
        content = request.data.get('comment')
        post_id = request.data.get('postId')
        try:    
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({"error": "post doesn't exists"}, status=status.HTTP_404_NOT_FOUND)
        
        data = {
            "content": content,
            "post": post.id,
            "user": request.user.id,
            "profile_img": request.user.profile.profile_img,
            "name": request.user.profile.name,
        }
        serializer = CommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "comment created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_post(request):
    if request.method == "POST":
        content = request.data.get('content')
        post_image = request.FILES.get('postImage')
        if not content:
            return Response({"message": "content is requires to create a post"}, status=status.HTTP_204_NO_CONTENT)
        
        post_data = {
            'content': content,
            'user': request.user.id,
        }
        if post_image:
            post_data['post_image'] = post_image
        
        serializer = PostSerializer(data=post_data)
        if serializer.is_valid():
            serializer.save()
            return Response({"messages": "post created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def delete_post(request):
    if request.method == "POST":
        post_id = request.data.get("postId")
        if post_id:
            try:
                post = get_object_or_404(Post, id=post_id)
                if post.user == request.user:
                    post.delete()
                    return Response({"message": "post was deleted successfully"}, status=status.HTTP_200_OK)
            except Post.DoesNotExist:
                return Response({"message": "post not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"message": "post id is required"}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def posts(request, pk):
    posts = Post.objects.filter(user=pk)
    if posts:
        serializer = ListPostSerializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({"message": "No posts available", 'data': []}, status=status.HTTP_200_OK)
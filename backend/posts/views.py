from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializers import ListPostSerializer, CommentSerializer
from .models import Post, Comment
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
            "user": request.user.id
        }
        serializer = CommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "comment created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



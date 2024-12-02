from django.db import models
from sorl.thumbnail import ImageField
from django.contrib.auth.models import User
from django.db.models.signals import post_save

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    profile_img = ImageField(upload_to='profile_images/', default='profile_images/default_img.jpg', null=True, blank=True)
    name = models.CharField(max_length=30, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    birthday = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.user.username

def create_profile(sender, created, instance, **kwargs):
    if created:
        user_profile = Profile(user=instance)
        user_profile.save()

post_save.connect(create_profile, sender=User)

class Follower(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='follower')
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following')
    
    class Meta:
        unique_together = ('follower', 'following')

    def __str__(self):
        return f'{self.follower.username} is following {self.following.username}'

   

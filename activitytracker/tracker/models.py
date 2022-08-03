from unicodedata import name
from django.db import models
from django.contrib.auth import get_user_model
from django.conf import settings
User = get_user_model()

# Create your models here.
class trackdetails(models.Model):
    opentabs=models.CharField(max_length=800)
    closetabs=models.CharField(max_length=800)
    activetime=models.CharField(max_length=800)
    email=models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
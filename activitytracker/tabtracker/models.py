from enum import unique
from unicodedata import name
from django.db import models
from django.contrib.auth import get_user_model
from django.conf import settings
User = get_user_model()

# Create your models here.
class trackdetails(models.Model):
    opentabs=models.CharField(max_length=60000,null=True,default='')
    closetabs=models.CharField(max_length=60000,null=True,default='')
    activetime=models.CharField(max_length=60000,null=True,default='')
    email=models.EmailField(max_length=85,unique=True)

class alarmdetail(models.Model):
    alarmdet=models.CharField(max_length=60000,null=True,default='')
    email=models.EmailField(max_length=85,unique=False)


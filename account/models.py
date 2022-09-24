from enum import unique
from django.db import models
from django.forms import CharField, EmailField
from numpy import unicode_
from django.contrib.auth.hashers import make_password

# Create your models here.
class userdetails(models.Model):
    email=models.EmailField(unique=True,max_length=200,primary_key=True,null=False)
    passw=models.CharField(null=False,max_length=20)
# def save(self, *args, **kwargs):
#         if not self.pk:
#             self.password = make_password(self.password)
#             # encrypt_field_value_here
#         super(userdetails, self).save(*args, **kwargs)

# def save(self, *args, **kwargs):
#         super(userdetails, self).save(*args, **kwargs)

class userLogin(models.Model):
    email=models.ForeignKey(userdetails,on_delete=models.DO_NOTHING)
    login_time=models.TimeField()


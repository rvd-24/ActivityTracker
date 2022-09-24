from django.urls import path,re_path
from . import views

urlpatterns=[
    path('register',views.register,name='register'),
    path('',views.login,name='login'),
    path('logout',views.logout,name='logout')
]
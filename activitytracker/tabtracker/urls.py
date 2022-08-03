from django.urls import path,re_path
from . import views
from .views import update_tabs

urlpatterns=[
    re_path(r'^update_tabs/',views.update_tabs,name="update_tabs"),
    path('home',views.home,name="home")
]
from django.urls import path,re_path
from . import views
from .views import update_tabs

urlpatterns=[
    re_path(r'^update_tabs/',views.update_tabs,name="update_tabs"),
    re_path(r'^sendchartdata/',views.sendchartdata,name="sendchartdata"),
    path('home',views.home,name="home"),
    path('setalarms',views.setalarms,name='alarms'),
    re_path(r'set_alarms/',views.set_alarms,name='set_alarms'),
    path(r'deletealarms/<str:alarmurl>',views.deletealarms,name='deletealarms')
]
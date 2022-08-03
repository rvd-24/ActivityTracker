from django.http import HttpResponse
from django.shortcuts import render
from tabtracker.models import trackdetails

def index(request):
    if request.user.is_authenticated and trackdetails.objects.filter(email=request.user.email).exists():
        tabdetails=trackdetails.objects.get(email=request.user.email)
        print("Hi",tabdetails)
        opentabs=eval(tabdetails.opentabs)
        closedtabs=eval(tabdetails.closetabs)
        activetime=eval(tabdetails.activetime)
        print(opentabs)
        print(closedtabs)
        print(activetime)
        Tabdetails=[opentabs,closedtabs,activetime]
        return render(request,'trackwebpage.html',{'opentabs':opentabs,'closedtabs':closedtabs,'activetime':activetime})
    else:
        return render(request,'trackwebpage.html')
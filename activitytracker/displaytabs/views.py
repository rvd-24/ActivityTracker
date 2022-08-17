from django.http import HttpResponse
from django.shortcuts import render
from tabtracker.models import trackdetails
from datetime import datetime
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
        todayminutes=0
        todayhour=0
        todaysec=0
        # print(activetime)
        print("Displaytabs")
        urls=[]
        for d in opentabs:
            urls.append(d['url'])
        print(urls)
        for d in activetime:
                todayminutes+=d['minutes']
                todaysec+=d['seconds']
                todayhour+=d['hours']
                if(todaysec==60):
                    todaysec=0
                    todayminutes+=1
                    if(todayminutes==60):
                        todayminutes=0
                        todayhour+=1
        opent=[]
        for i in opentabs:
            s = i['opentime']
            print(s)
            f = "%Y-%m-%dT%H:%M:%S.%fZ"
            out = datetime.strptime(s, f)
            opent.append(out)
        print("OPENTIME")
        print(opent)
        senddata={}
        print("SENDDATA")
        senddata['opentabs']=opentabs
        senddata['closedtabs']=closedtabs
        senddata['activetime']=activetime
        senddata['todayminutes']=todayminutes
        senddata['todaysec']=todaysec
        senddata['todayhour']=todayhour
        print(senddata)
        print(datetime.now())
        Tabdetails=[opentabs,closedtabs,activetime]
        return render(request,'trackwebpage.html',{'opentabs':opentabs,'closedtabs':closedtabs,'activetime':activetime,'urls':urls,'senddata':senddata})
    else:
        return render(request,'trackwebpage.html')
import json
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.http import HttpResponse
from .forms import ContactModelForm
from datetime import datetime
from django.contrib.auth import get_user_model
User = get_user_model()
import pytz
import re
from django.utils import timezone


def convert_to_localtime(utctime):
  fmt = "%Y-%m-%dT%H:%M:%S.%fZ"
  utc = utctime.replace(tzinfo=pytz.UTC)
  localtz = utc.astimezone(timezone.get_current_timezone())
  return localtz.strftime(fmt)


def home(request):
    return render(request,"indexw.html")

def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'

from django.views.decorators.csrf import csrf_exempt
from .models import trackdetails,alarm

def user_exists(email):
    return User.objects.filter(email=email).exists()

@csrf_exempt
def update_tabs(request):
    senddata=""
    if request.method == 'POST':
            tabs = request.POST.get('stuff',False)
            t=json.loads(tabs)
            opentabs=t['opentabs']
            close=t['closetabs']
            active=t['activetime']
            chkactive=[]
            
            for i in opentabs:
                s = i['opentime']
                f = "%Y-%m-%dT%H:%M:%S.%fZ"
                out = datetime.strptime(s, f)
                out=convert_to_localtime(out)
                i['opentime']=out
                

            for i in active:
                chkactive.append(i['id'])
            active=active[1:]
            
            # print(active)
            x={}
            senddata+=str(opentabs)+";"+str(close)+";"+str(active)+";"
            if request.user.is_authenticated:
                print('User'+request.user.email+" : ",user_exists(request.user.email))
                if user_exists(request.user.email) and trackdetails.objects.filter(email=request.user.email).exists():
                    print("Updated stored details")
                    stuff=trackdetails.objects.get(email=request.user.email)
                    stuff.opentabs=eval(stuff.opentabs)
                    stuff.closetabs=eval(stuff.closetabs)
                    stuff.activetime=eval(stuff.activetime)

                    stuffchk=[]

                    for i in stuff.activetime:
                        stuffchk.append(i['id'])

                    openlst=[x for x in opentabs if x not in stuff.opentabs]
                    closelst=[x for x in close if x not in stuff.closetabs]
                    activelst=[x for x in chkactive if x not in stuffchk]
                    print("Updated active time",activelst)
                    
                    # for i in opentabs:
                    #     print(i)
                    # for j in active :
                    #     print(j)
                    # for i in opentabs:
                    #     for j in active:
                    #         if(i['id'] not in j.values()):
                    #             print(i['id'],j['id'])

                    for i in activelst:
                        for j in active:
                            if(j['id']==i):
                                stuff.activetime.append(j)
                    
                    for i in stuff.activetime:
                        for j in active:
                            if(i['id']==j['id']):
                                i.update(j)
                    
                    # print("Updated list",openlst)
                    for i in openlst:
                        stuff.opentabs.append(i)
                    
                    for j in closelst:
                        stuff.closetabs.append(j)
                    # for k in activelst:
                    #     stuff.activetime.append(k)

                    # print("stuff.opentabs",stuff.opentabs)
                    stuff.opentabs=str(stuff.opentabs)
                    stuff.closetabs=str(stuff.closetabs)
                    stuff.activetime=str(stuff.activetime)
                    stuff.email=request.user.email
                    
                    stuff.save()
                    print("username:",request.user.username)
                else:
                    print("Saved stuff")
                    stuff=trackdetails(opentabs=str(opentabs),closetabs=str(close),activetime=str(active),email=request.user.email)
                    stuff.save()
                print("email:",request.user.email)
                
    if request.user.is_authenticated:
        return HttpResponse(request.user.username)
    else:
        return HttpResponse("Not logged in")

def sendchartdata(request):
    if request.method=='GET':
        if request.user.is_authenticated and trackdetails.objects.filter(email=request.user.email).exists():
            tabdetails=trackdetails.objects.get(email=request.user.email)
            print("Send Chart Data")
            opentabs=eval(tabdetails.opentabs)
            closedtabs=eval(tabdetails.closetabs)
            activetime=eval(tabdetails.activetime)
            todayminutes=0
            todayhour=0
            todaysec=0
            
            for d in activetime:
                todayminutes+=d['minutes']
                todaysec+=d['seconds']
                todayhour+=d['hours'] 
                
            senddata={}
            senddata['opentabs']=opentabs
            senddata['closedtabs']=closedtabs
            senddata['activetime']=activetime
            senddata['todayminutes']=todayminutes
            senddata['todaysec']=todaysec
            senddata['todayhour']=todayhour
            Tabdetails=[opentabs,closedtabs,activetime]
            return HttpResponse(json.dumps(senddata), content_type="application/json")
    else:
        return HttpResponse('indexw.html')

def set_alarms(request):
    if request.method=='GET':
        if request.user.is_authenticated  and alarm.objects.filter(email=request.user.email).exists():
            alarms=alarm.objects.get(email=request.user.email)
            url=alarms.url
            time=alarms.time
            sendalarm={}
            sendalarm['url']=url
            sendalarm['time']=time
            return HttpResponse(json.dumps(sendalarm),content_type="application/json")

def setalarms(request):
    print(request.method)
    if request.method=='POST':
        url=request.POST['url']
        hour=int(request.POST['hour'])
        minute=int(request.POST['minute'])
        time=minute*60+hour*60*60
        print("TIME",time)
        stuff=trackdetails.objects.get(email=request.user.email)
        opentabs=eval(stuff.opentabs)
        activetime=eval(stuff.activetime)
        closetabs=eval(stuff.closetabs)
        urlopen=[]
        for i in opentabs:
            for j in closetabs:
                for k in activetime:
                    if(i['id']==j['id'] and i['id']==k['id']):
                        opentabs.remove(i)
                        activetime.remove(k)
        
        # for i in opentabs:
        #     for j in activetime:
        #         if(i['id']==j['id']):
        #             print("removed",i,j)

        for i in opentabs:
            for j in activetime:
                if(i['id']==j['id']):
                    print(i['url'])
                    if url in i['url']:
                        print("FOUND",url,i['url'])
                        stuff=alarm(url=url,time=time,email=request.user.email)
                        stuff.save()
    return render(request,'alarmindex.html')

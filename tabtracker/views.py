import json
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render,redirect
from django.http import HttpResponse
from .forms import ContactModelForm
from datetime import datetime
from django.contrib.auth import get_user_model
from django.contrib import messages

User = get_user_model()
import pytz
import re
from datetime import datetime
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
from .models import trackdetails
from .models import alarmdetail

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
            return HttpResponse(json.dumps(senddata),content_type="application/json")
    else:
        return HttpResponse('indexw.html')

def setalarms(request):
    print(request.method)
    if request.method=='POST':
        url=request.POST['url']
        hour=int(request.POST['hour'])
        minute=int(request.POST['minute'])
        time=minute*60+hour*60*60
        print("Time fetched for alarm:",time)
        stuff=trackdetails.objects.get(email=request.user.email)
        opentabs=eval(stuff.opentabs)
        activetime=eval(stuff.activetime)
        closetabs=eval(stuff.closetabs)
        alarmdetails=[]
        checkalarmflag=0
        getalarmname=""
        for i in opentabs:
            for j in closetabs:
                for k in activetime:
                    if(i['id']==j['id'] and i['id']==k['id']):
                        opentabs.remove(i)
                        activetime.remove(k)
        
        if alarmdetail.objects.filter(email=request.user.email).exists():
            stuff=alarmdetail.objects.get(email=request.user.email)
            alarm=eval(stuff.alarmdet)
            print(type(alarm))
            for i in opentabs:
                for j in activetime:
                    if(i['id']==j['id']):
                        if url in i['url']:
                            print("Url Exists:",url,i['url'])
                            getalarmname=i['url']
                            checkalarmflag=1
            if(checkalarmflag==1):
                detail={}
                now=datetime.now()
                datestr=now.strftime("%d/%m/%Y %H:%M:%S")
                detail['url']=getalarmname
                detail['time']=time
                detail['settime']=datestr
                alarmdetails.append(detail)
                print("Alarm before updating",alarm)
                lst=[]
                updateflag=0
                for i in alarm:
                    if(i['url'] in getalarmname):
                       i['time']=time
                       i['Set time']=datestr
                       updateflag=1
                
                if(updateflag==0):
                    alarm.append(detail)
                print("Detail",detail)
                print("SAKGHJDJGH",alarm)
                print("LST",lst)
                stuff.alarmdet=str(alarm)
                stuff.email=request.user.email
                stuff.save()
                print("Alarm Updated!")
                        
            else:
                print("Url has never been active or opened!")
                messages.info(request,"Url has never been active or opened!")
        else:
            for i in opentabs:
                for j in activetime:
                    if(i['id']==j['id']):
                        if url in i['url']:
                            print("FOUND",url,i['url'])
                            getalarmname=i['url']
                            checkalarmflag=1
            if(checkalarmflag==1):
                detail={}
                now=datetime.now()
                datestr=now.strftime("%d/%m/%Y %H:%M:%S")
                detail['url']=getalarmname
                detail['time']=time
                detail['settime']=datestr
                alarmdetails.append(detail)
            else:
                print("Alarm Url has never been active or opened!")
                messages.info(request,"Alarm URL has never been active or opened!")
            print("Alarm Set")                
            stuff=alarmdetail(alarmdet=str(alarmdetails),email=request.user.email)
            stuff.save()
    else:
        print("Incorrect request")
    #To Display the alarms on the webpage
    if request.user.is_authenticated and alarmdetail.objects.filter(email=request.user.email).exists():
        alarm=alarmdetail.objects.get(email=request.user.email)
        alarm=eval(alarm.alarmdet)
        # print(alarm)
        return render(request,'alarmindex.html',{'alarm':alarm})
    else:
        return render(request,'alarmindex.html')

#To send the alarms back to background.js to set the alert in js
def set_alarms(request):
    if request.method=='GET':
        if request.user.is_authenticated  and alarmdetail.objects.filter(email=request.user.email).exists():
            alarmstuff=alarmdetail.objects.get(email=request.user.email)
            alarm=eval(alarmstuff.alarmdet)
            return HttpResponse(json.dumps(alarm),content_type="application/json")
        else:
            return render(request,'alarmindex.html')

def deletealarms(request,alarmurl):
    if request.user.is_authenticated  and alarmdetail.objects.filter(email=request.user.email).exists():
            alarmstuff=alarmdetail.objects.get(email=request.user.email)
            alarm=eval(alarmstuff.alarmdet)
            for i in alarm:
                if(i['url']==alarmurl):
                    alarm.remove(i)  
            alarmstuff.alarmdet=str(alarm)
            alarmstuff.email=request.user.email
            alarmstuff.save()
            return redirect("http://127.0.0.1:8000/setalarms")
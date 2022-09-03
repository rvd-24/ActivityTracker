import json
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.http import HttpResponse
from .forms import ContactModelForm
from django.contrib.auth import get_user_model
User = get_user_model()
# Create your views here.
def home(request):
    return render(request,"indexw.html")
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'
from django.views.decorators.csrf import csrf_exempt
from .models import trackdetails

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
            x={}
            senddata+=str(opentabs)+";"+str(close)+";"+str(active)+";"
            if request.user.is_authenticated:
                print('User'+request.user.email+" : ",user_exists(request.user.email))
                if user_exists(request.user.email) and trackdetails.objects.filter(email=request.user.email).exists():
                    print("Updated stored details")
                    stuff=trackdetails.objects.get(email=request.user.email)
                    stuff.opentabs=eval(stuff.opentabs)
                    print("Stuff.opentabs",stuff.opentabs)
                    print("OPent",opentabs)
                    # stuff.opentabs.append(str(opentabs))
                    # stuff.closetabs=eval(stuff.closetabs)
                    # stuff.closetabs.append(str(stuff.closetabs))
                    # stuff.activetime=eval(stuff.activetime)
                    # stuff.activetime.append(str(stuff.activetime))
                    # for i in stuff.opentabs:
                    # for i in opentabs:
                    #     stuff.opentabs.append(i)
                    # for j in stuff.opentabs:
                    #     for i in opentabs:
                    #         if(i['id']==j['id'] and i['url']!=j['url']):
                    #             print("Same id",i)
                    #         elif (i['id'] not in j):
                    #                 print("DifferentID",i)

                    lst=[x for x in opentabs if x not in stuff.opentabs]
                    print("lst",lst)
                    for i in lst:
                        stuff.opentabs.append(i)
                    # print(stuff.opentabs)
                    # stuff.opentabs=str(stuff.opentabs)                    
                    # stuff.opentabs=str(opentabs)
                    stuff.opentabs=str(stuff.opentabs)
                    stuff.closetabs=str(close)
                    stuff.activetime=str(active)
                    stuff.email=request.user.email
                    # stuff=trackdetails(opentabs=str(Open),closetabs=str(close),activetime=str(active),email=request.user.email)
                    stuff.save()
                    print(request.user.username)
                else:
                    print("Saved stuff")
                    stuff=trackdetails(opentabs=str(opentabs),closetabs=str(close),activetime=str(active),email=request.user.email)
                    stuff.save()
                print(request.user.email)
                print(request.user)
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
            # print(activetime)
            for d in activetime:
                todayminutes+=d['minutes']
                todaysec+=d['seconds']
                todayhour+=d['hours'] 
                # for key in d.keys(): 
                #     print("Key: {}, value: {}".format(key, d[key]))
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


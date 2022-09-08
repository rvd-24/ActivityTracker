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
            chkactive=[]
            for i in active:
                chkactive.append(i['id'])
            active=active[1:]
            print(active)
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
                    for i in stuff.activetime:
                        print(i)
                    print("Updated list",openlst)
                    for i in openlst:
                        stuff.opentabs.append(i)
                    
                    for j in closelst:
                        stuff.closetabs.append(j)
                    # for k in activelst:
                    #     stuff.activetime.append(k)

                    
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
                # print(request.user)
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


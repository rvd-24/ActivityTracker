from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.http import HttpResponse
from .forms import ContactModelForm
from django.contrib.auth import get_user_model
User = get_user_model()
# Create your views here.
def home(request):
    return render(request,"trackwebpage.html")
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'
from django.views.decorators.csrf import csrf_exempt
from .models import trackdetails

def user_exists(email):
    return User.objects.filter(email=email).exists()

@csrf_exempt
def update_tabs(request):
    if request.method == 'POST':
            tabs = request.POST.get('stuff',False)
            # print(tabs)
            # print(tabs.closetabs)
            t=eval(tabs)
            print(t)
            # for key,value in t.items():
            #     print(key ,value)
            Open=t['opentabs']
            close=t['closetabs']
            active=t['activetime']
            if request.user.is_authenticated:
                print('User'+request.user.email+" : ",user_exists(request.user.email))
                if user_exists(request.user.email) and trackdetails.objects.filter(email=request.user.email).exists():
                    print("Updated stored details")
                    stuff=trackdetails.objects.get(email=request.user.email)
                    stuff.opentabs=str(Open)
                    stuff.closetabs=str(close)
                    stuff.activetime=str(active)
                    print(stuff.activetime)
                    stuff.email=request.user.email
                    # stuff=trackdetails(opentabs=str(Open),closetabs=str(close),activetime=str(active),email=request.user.email)
                    stuff.save()
                else:
                    print("Saved stuff")
                    stuff=trackdetails(opentabs=str(Open),closetabs=str(close),activetime=str(active),email=request.user.email)
                    stuff.save()
                print(request.user.email)
                # user=User.objects.get(email=request.user.email)
                # print(user.email)
                # stuff.save()
                
        # try:
        #     print(tabs)
        # except trackdetails.DoesNotExist:
        #     tabs=None
        # tabs.name =  request.POST['currTabs']
        # tabs.save()
    # if request.is_ajax():
    #     form=ContactModelForm(request.POST)
    #     if form.is_valid():
    #         form.save()
    #         return JsonResponse({
    #             "msg":"Success"
    #         })
    return HttpResponse('update successful')
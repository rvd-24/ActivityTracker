from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.http import HttpResponse
from ..tabtracker.forms import ContactModelForm
# Create your views here.
def home(request):
    return render(request,"trackwebpage.html")
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'
from django.views.decorators.csrf import csrf_exempt
from .models import trackdetails
@csrf_exempt
def update_tabs(request):
    if request.method == 'POST':
            tabs = request.POST.get('stuff',False)
            # print(type(tabs))
            t=eval(tabs)
            #print(t)
            for key,value in t.items():
                print(key ,value)
            Open=t['opentabs']
            close=t['closetabs']
            active=t['activetime']
            stuff=trackdetails(opentabs=str(Open),closetabs=str(close),activetime=str(active))
            stuff.save()
                
        # try:
        #     print(tabs)
        # except trackdetails.DoesNotExist:
        #     tabs=None
        # tabs.name =  request.POST['currTabs']
            print('hello')
        # tabs.save()
    # if request.is_ajax():
    #     form=ContactModelForm(request.POST)
    #     if form.is_valid():
    #         form.save()
    #         return JsonResponse({
    #             "msg":"Success"
    #         })
    return HttpResponse('update successful')
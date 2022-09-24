from typing import Set
from django.http import HttpResponse
from django.shortcuts import render
from tabtracker.models import trackdetails
from tabtracker.models import alarmdetail
from datetime import datetime
import pytz
from django.utils import timezone


def convert_to_localtime(utctime):
  fmt = "%Y-%m-%dT%H:%M:%S.%fZ"
  utc = utctime.replace(tzinfo=pytz.UTC)
  localtz = utc.astimezone(timezone.get_current_timezone())
  return localtz.strftime(fmt)

def gettime(sec):
  sec=sec%(24*3600)
  hour=sec//3600
  sec%= 3600
  minutes=sec//60
  sec%=60
  return hour,minutes,sec


def index(request):
  if request.user.is_authenticated and trackdetails.objects.filter(email=request.user.email).exists():
    tabdetails=trackdetails.objects.get(email=request.user.email)

    opentabs=eval(tabdetails.opentabs)
    closedtabs=eval(tabdetails.closetabs)
    activetime=eval(tabdetails.activetime)
    
    todayminutes=0
    todayhour=0
    todaysec=0
    
    yesterdayhour=0
    yesterdayminutes=0
    yesterdaysec=0
    
    thisweekhour=0
    thisweekminutes=0
    
    lastweekhour=0
    lastweekminutes=0
        
    
    opent=[]
    yesterday=[]
    
    for i in opentabs:
        s = i['opentime']
        f = "%Y-%m-%dT%H:%M:%S.%fZ"
        
        out = datetime.strptime(s, f)
        ds={"opentime":out,"id":i['id'],"url":i['url'],"fullurl":i['fullurl']}
        opent.append(ds)
    
    senddata={}
    todaytime=0
    yesterdaytime=0
    thisweektime=0
    lastweektime=0
    # print(opent)
    for i in opent:
      if((datetime.now()-i['opentime']).days>=1 and (datetime.now()-i['opentime']).days<2):
        for j in activetime:
          if(i['id'] in j.values()):
            # print("Yesterday",i)
            # print(j)
            # print("\n")
            yesterdaytime+=j['seconds']+j['minutes']*60+j['hours']*60*60
      
      if((datetime.now()-i['opentime']).days<1):
        for j in activetime:
          if(j['id'] in i.values()):
            todaytime+=j['seconds']+j['minutes']*60+j['hours']*60*60
            # print(todaytime)
      
      if((datetime.now()-i['opentime']).days<=7):
        for j in activetime:
          if(j['id'] in i.values()):
            thisweektime+=j['seconds']+j['minutes']*60+j['hours']*60*60
            # print(i['url'],i['opentime'])
      
      if((datetime.now()-i['opentime']).days>7 and (datetime.now()-i['opentime']).days<14):
        for j in activetime:
          if(i['id']==j['id']):
            lastweektime+=j['seconds']+j['minutes']*60+j['hours']*60*60

      # print("DaysDiff",(datetime.now()-i['opentime']).days,i['opentime'])
    
   
    todayhour,todayminutes,todaysec=gettime(todaytime)
    yesterdayhour,yesterdayminutes,yesterdaysec=gettime(yesterdaytime)
    thisweekhour,thisweekminutes,thisweeksec=gettime(thisweektime)
    lastweekhour,lastweekminutes,lastweeksec=gettime(lastweektime)
    thisweeknumdays=thisweektime//(24*3600)
    lastweeknumdays=lastweektime//(24*3600)
    
    mostused=sorted(activetime, key=lambda d: d['minutes'])
    mostused=mostused[1:]
    mostused.reverse()

    for i in range(len(opent)):
      for j in range(len(mostused)):
        if(mostused[j]['id']==opent[i]['id']):
          mostused[j]['url']=opent[i]['url']
          mostused[j]['opentime']=opent[i]['opentime']
          mostused[j]['fullurl']=opent[i]['fullurl']

    
    finalmostusedtoday=[]
    finalmostusedthisweek=[]
  
    for i in mostused:    
      if "url" not in i:
        mostused.remove(i);
        continue;
      if "opentime" not in i:
        mostused.remove(i);
    
    for i in mostused:
      if "opentime" not in i:
        mostused.remove(i)

    for i in mostused:
      if((datetime.now()-i['opentime']).days<1):
        finalmostusedtoday.append(i)
      
    for i in mostused:
      if ((datetime.now()-i['opentime']).days<=7):
        finalmostusedthisweek.append(i)

    for i in finalmostusedtoday:
      print("FMT",i)
    # for i in finalmostusedthisweek:
    #   print("FMTW",i)
    finalmostusedtoday=finalmostusedtoday[:5]
    finalmostusedthisweek=finalmostusedthisweek[:5]

    # print("Today",todayhour,todayminutes)
    # print(todaytime)
    # print(thisweektime)

    senddata['opentabs']=opentabs
    senddata['closedtabs']=closedtabs
    senddata['activetime']=activetime
    
    #Today Data
    senddata['todayminutes']=todayminutes
    senddata['todaysec']=todaysec
    senddata['todayhour']=todayhour
    senddata['todaytotaltime']=todaytime
    
    #Yesterday Data
    senddata['yesterdayhour']=yesterdayhour
    senddata['yesterdayminutes']=yesterdayminutes
    senddata['yesterdaysec']=yesterdaysec
    senddata['yesterdaytotaltime']=yesterdayhour*60*60+yesterdayminutes*60+yesterdaysec
    
    #This Week
    senddata['thisweeknumdays']=thisweeknumdays
    senddata['thisweekhour']=thisweekhour
    senddata['thisweekminutes']=thisweekminutes
    
    #Last Week
    senddata['lastweeknumdays']=lastweeknumdays
    senddata['lastweekhour']=lastweekhour
    senddata['lastweekminutes']=lastweekminutes

    #Percent Change24Hours
    if(yesterdaytime==0):
      yesterdaytime=1

    change24hrs=((todaytime-yesterdaytime)/yesterdaytime)*100
    if(int(change24hrs)>0):
      change24hrs="+"+str(int(change24hrs))
    else:
      change24hrs="-"+str(abs(int(change24hrs))) 
    
    senddata['change24hrs']=change24hrs
    
    #Percent ChangeWeek
    if(lastweektime==0):
      lastweektime=1

    changeweek=((thisweektime-lastweektime)/604800)*100
    if(int(changeweek)>0):
      changeweek="+"+str(int(changeweek))
    else:
      changeweek="-"+str(abs(int(changeweek))) 
    
    senddata['changeweek']=changeweek

    print("yesterdaytotaltime",senddata['yesterdaytotaltime'])
    print("todaytotaltime",senddata['todaytotaltime'])
    print("thisweekhour",senddata['thisweekhour'])
    print("thisweekminutes",senddata['thisweekminutes'])
    # print(senddata)
    # print(datetime.now())
    return render(request,'indexw.html',{'opentabs':opentabs,'closedtabs':closedtabs,'activetime':activetime,'senddata':senddata,'mostusedtoday':finalmostusedtoday,'mostusedthisweek':finalmostusedthisweek})
  else:
      return render(request,'indexw.html')


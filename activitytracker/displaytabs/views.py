from django.http import HttpResponse
from django.shortcuts import render
from tabtracker.models import trackdetails
from datetime import datetime

def getDuration(then, now = datetime.now(), interval = "default"):

    duration = now - then
    duration_in_s = duration.total_seconds() 
    
    def years():
      return divmod(duration_in_s, 31536000)

    def days(seconds = None):
      return divmod(seconds if seconds != None else duration_in_s, 86400)

    def hours(seconds = None):
      return divmod(seconds if seconds != None else duration_in_s, 3600)

    def minutes(seconds = None):
      return divmod(seconds if seconds != None else duration_in_s, 60)

    def seconds(seconds = None):
      if seconds != None:
        return divmod(seconds, 1)   
      return duration_in_s

    def totalDuration():
        y = years()
        d = days(y[1]) 
        h = hours(d[1])
        m = minutes(h[1])
        s = seconds(m[1])

        return "Time between dates: {} years, {} days, {} hours, {} minutes and {} seconds".format(int(y[0]), int(d[0]), int(h[0]), int(m[0]), int(s[0]))

    return {
        'years': int(years()[0]),
        'days': int(days()[0]),
        'hours': int(hours()[0]),
        'minutes': int(minutes()[0]),
        'seconds': int(seconds()),
        'default': totalDuration()
    }


def index(request):
    if request.user.is_authenticated and trackdetails.objects.filter(email=request.user.email).exists():
        tabdetails=trackdetails.objects.get(email=request.user.email)
        print("TabDetails\n",tabdetails,"\n")
        opentabs=eval(tabdetails.opentabs)
        closedtabs=eval(tabdetails.closetabs)
        activetime=eval(tabdetails.activetime)
        print("OPENTABS",opentabs)
        
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
        # print(activetime)
        print("Displaytabs")
        urls=[]
        for d in opentabs:
            urls.append(d['url'])
        print(urls)
        for d in activetime:
            if(todaysec==60):
                    todaysec=0
                    todayminutes+=1
                    if(todayminutes==60):
                        todayminutes=0
                        todayhour+=1
            todayminutes+=d['minutes']
            todaysec+=d['seconds']
            todayhour+=d['hours']
        opent=[]
        yesterday=[]
        for i in opentabs:
            s = i['opentime']
            f = "%Y-%m-%dT%H:%M:%S.%fZ"
            # diff=s-datetime.now()
            # yesterday.append(diff)
            out = datetime.strptime(s, f)
            ds={"opentime":out,"id":i['id'],"url":i['url']}
            opent.append(ds)
        print("OPENTIME")
        senddata={}
        print(opent[1]["opentime"])
        for i in range(len(opent)):
            print(getDuration(opent[i]['opentime'])['days'])
            if(getDuration(opent[i]['opentime'])['days']>0 and getDuration(opent[i]['opentime'])['days']<=1):
                yesterdayhour+=getDuration(opent[i]['opentime'])['hours']
                yesterdayminutes+=getDuration(opent[i]['opentime'])['minutes']
                yesterdaysec+=getDuration(opent[i]['opentime'])['seconds']

            if(getDuration(opent[i]['opentime'])['days']<=7):
                print("This Week Details")
                # print(thisweekhour,opent[i]['opentime'],getDuration(opent[i]['opentime']))
                for j in range(0,len(activetime)):
                  # print("ACT",activetime[j]['id'])
                  # print("OPENT",opent[i]['id'])
                  if(activetime[j]['id']==opent[i]['id']):
                    print("activetime:",activetime[j])
                    thisweekhour+=activetime[j]['hours']
                    thisweekminutes+=activetime[j]['minutes']
                
            if(getDuration(opent[i]['opentime'])['days']>=8 and getDuration(opent[i]['opentime'])['days']<15):
                print("LastWeek",getDuration(opent[i]['opentime'])['hours'])
                lastweekhour+=getDuration(opent[i]['opentime'])['hours']
                lastweekminutes+=getDuration(opent[i]['opentime'])['minutes']
        
        
        mostused=sorted(activetime, key=lambda d: d['minutes'])
        mostused=mostused[1:]
        mostused.reverse()
        for i in range(len(opentabs)):
          for j in range(len(mostused)):
            if(mostused[j]['id']==opentabs[i]['id']):
              mostused[j]['url']=opentabs[i]['url']
              mostused[j]['url']=mostused[j]['url'][:30]

        print("MostUsed:",mostused)
        mostused=mostused[:5]
        senddata['opentabs']=opentabs
        senddata['closedtabs']=closedtabs
        senddata['activetime']=activetime
        #Today Data
        senddata['todayminutes']=todayminutes
        senddata['todaysec']=todaysec
        senddata['todayhour']=todayhour
        senddata['todaytotaltime']=todayhour*60*60+todayminutes*60+todaysec
        #Yesterday Data
        senddata['yesterdayhour']=yesterdayhour
        senddata['yesterdayminutes']=yesterdayminutes
        senddata['yesterdaysec']=yesterdaysec
        senddata['yesterdaytotaltime']=yesterdayhour*60*60+yesterdayminutes*60+yesterdaysec
        #This Week
        senddata['thisweekhour']=thisweekhour
        senddata['thisweekminutes']=thisweekminutes
        #Last Week
        senddata['lastweekhour']=lastweekhour
        senddata['lastweekminutes']=lastweekminutes
        print(senddata['yesterdaytotaltime'])
        print(senddata['todaytotaltime'])
        print(senddata['thisweekhour'])
        print(senddata['thisweekminutes'])
        # print(senddata)
        print(datetime.now())
        Tabdetails=[opentabs,closedtabs,activetime]
        return render(request,'trackwebpage.html',{'opentabs':opentabs,'closedtabs':closedtabs,'activetime':activetime,'urls':urls,'senddata':senddata,'mostused':mostused})
    else:
        return render(request,'trackwebpage.html')


#Trash Code
 # diff=datetime.now()-opent[i]
            # duration_in_s = diff.total_seconds()
            # hours = divmod(duration_in_s, 3600)[0]
            # minutes = divmod(duration_in_s, 60)[0]
            # seconds = diff.seconds                    # Build-in datetime function
            # # seconds = duration_in_s
            # print("SEC",seconds)
            # days  = diff.days                       # Build-in datetime function
            # days  = divmod(duration_in_s, 86400)[0]
            # print("DAYS",days)
            # print(diff)
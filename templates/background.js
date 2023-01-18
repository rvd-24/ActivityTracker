console.log("Background script is running")
var openTabs = {};
var closeTabs={};
let [milliseconds,second,minute,hour] = [0,0,0,0];
let timerRef = document.querySelector('.mainTime');
let int = null;
let tabtime={
    hours:"",
    minutes:"",
    seconds:"",
    millisec:""
}
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}
var tabdata={
    "user_authenticated":"",
    "opentabs":[{
        "id":"",
        "url":"",
        "opentime":"",
        "fullurl":""
    }],
    "closetabs":[{
        "id":"",
        "url":"",
        "fullurl":"",
        "closetime":"",
        "totaltime":""
    }],
    "activetime":[{
        "id":"",
        "hours":0,
        "minutes":0,
        "seconds":0,
        "millisec":0
    }],
    "Alarms":[{
        "url":"",
        "time":0
    }]
}
var alarmtime=[{
    "id":"",
    "url":"",
    "hours":0,
    "minutes":0,
     "seconds":0,
     "alarmfired":false,
     "fire_count":0
}]
chrome.tabs.query({windowType:'normal'},function(tabs){
    let [milliseconds,seconds,minutes,hours] = [0,0,0,0];
    let timerRef = document.querySelector('.timerDisplay');
    let int = null;
    tabdata.opentabs.pop();
    tabdata.closetabs.pop();
    for(i=0;i<tabs.length;i++){
        if(tabs[i].url!='chrome://newtab/'&&tabs[i].url.includes("file://")===false){
                try{
                    var u=new URL(tabs[i].url);
                }
                catch(err){
                    console.log(err);
                    console.log("Please refresh the extension");
                }
                tabdata.opentabs.push({id:tabs[i].id,url:u.hostname,opentime:new Date(),fullurl:u.href});
            }
    }
    console.log(tabdata.opentabs);
    chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
        tabexists=false;
        console.log(tabId);
        for(var i=0;i<tabdata.opentabs.length;i++){
            if(tabdata.opentabs[i].id===tab.tabId && tabdata.opentabs[i].url===tab.url){
                tabexists=true;
            }
        }
        if(tabexists===false){
            var d=new Date();
            if(tab.url!='chrome://newtab/'&&tab.url.includes("file://")===false){
                var u=new URL(tab.url)
                // console.log(u.hostname);
                tabdata.opentabs.push({id:tab.id,url:u.hostname,opentime:d,fullurl:u.href});
            }
        }
        // console.log(tabdata.opentabs);
        tabdata.opentabs = tabdata.opentabs.filter((value, index, self) =>
            index === self.findIndex((t) => (
                t.id === value.id && t.url === value.url
            ))
        )
        console.log(tabdata.opentabs);
    });
    
    chrome.tabs.onRemoved.addListener(function(tab){
        console.log(tab);
        for(var i=0;i<tabdata.opentabs.length;i++){
            if(tabdata.opentabs[i].id===tab){
                var closedate=new Date();
                var totaltime=(closedate-tabdata.opentabs[i].opentime)/1000;
                tabdata.closetabs.push({id:tab,url:tabdata.opentabs[i].url,closetime:new Date(),totaltime:totaltime,fullurl:tabdata.opentabs[i].fullurl})
                tabexists=true;
            }
        } 
    });
    chrome.tabs.onActivated.addListener(function(tab){
        hour=0
        minute=0
        second=0
        milliseconds=0
        for(var i=0;i<tabdata.activetime.length;i++){
            if(tabdata.activetime[i].id===tab.tabId){
                hour=tabdata.activetime[i].hours
                minute=tabdata.activetime[i].minutes
                second=tabdata.activetime[i].seconds
                milliseconds=tabdata.activetime[i].millisec
            }
            /*else if(tabdata.activetime[i].id!==tab.tabId){
                console.log(tab.tabId);
                hour=0
                minute=0
                second=0
                milliseconds=0
            }*/
        }
        console.log("Tab Changed");
        if(int!==null){
            clearInterval(int);
        }
        int = setInterval(mainTime,10);
        function mainTime(){
            milliseconds+=10;
            if(milliseconds == 1000){
                    milliseconds = 0;
                    second++;
                if(second == 60){
                    second = 0;
                    minute++;
                    if(minute == 60){
                        minute = 0;
                        hours++;
                    }
                }
            }
            let h = hour < 10 ? "0" + hour : hour;
            let m = minute < 10 ? "0" + minute : minute;
            let s = second < 10 ? "0" + second : second;
            let ms = milliseconds < 10 ? "00" + milliseconds : milliseconds < 100 ? "0" + milliseconds : milliseconds;
            // timerRef.innerHTML = ` ${m} : ${s} : ${ms}`;
            // console.log(`${h} : ${m} : ${s} : ${ms}`);
            // console.log(`${s}`)
            tabtime.hours=`${h}`;
            tabtime.seconds=`${s}`;
            // tabtime.seconds=JSON.stringify(tabtime.seconds);
            tabtime.minutes= `${m}`;
            tabtime.millisec=`${ms}`
            // tabtime.minutes=JSON.stringify(tabtime.minutes);
            // tabtime.millisec=JSON.stringify(tabtime.millisec);
            // console.log(JSON.stringify(tabtime));                       
            tabidexists=false;
            for(var i=0;i<tabdata.activetime.length;i++){
                if(tabdata.activetime[i].id===tab.tabId){
                    tabdata.activetime[i].hours=parseInt(tabtime.hours);
                    tabdata.activetime[i].minutes=parseInt(tabtime.minutes);
                    tabdata.activetime[i].seconds=parseInt(tabtime.seconds);
                    tabdata.activetime[i].millisec=parseInt(tabtime.millisec);
                    tabidexists=true;
                    // console.log(tabdata.activetime[i].seconds);
                }
            }
            if(tabidexists===false){
                tabdata.activetime.push({id:tab.tabId,hours:parseInt(tabtime.hours),minutes:parseInt(tabtime.minutes),seconds:parseInt(tabtime.seconds),millisec:parseInt(tabtime.millisec)});
            }
    }
    console.log(tabdata.activetime);
    });
    djangoserverurl="http://127.0.0.1:8000/update_tabs/"
    setInterval(function submithandler(){
            console.log("Sending ajax request");
            $.ajax({
                type:"POST",
                url:djangoserverurl,
                data:{stuff:JSON.stringify(tabdata)},
                dataType:"json",
                beforeSend: function(x) {
                    if (x && x.overrideMimeType) {
                      x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                  },
                  success: function(recvmsg) {
                  console.log("Successfully sent")
                  if (recvmsg.msg==="Success"){
                    alert("Submitted")
                  }
                }
            })
        },5000);
        setInterval(function submithandler(){
            $.ajax({
                type:"GET",
                url:"http://127.0.0.1:8000/update_tabs/",
                dataType:"text",
                success: function(recvmsg) {
                    tabdata.user_authenticated=recvmsg;
                    console.log(recvmsg);
                    console.log("Receiving ajax request from update_tabs");
                }
            })
        },5000);
        djangoserveralarm="http://127.0.0.1:8000/set_alarms"
        setInterval(function submithandler(){
            $.ajax({
                type:"GET",
                url:djangoserveralarm,
                dataType:"json",
                success: function(recvmsg) {
                    // console.log(recvmsg);
                    recvmsg = recvmsg.filter((value, index, self) =>
                        index === self.findIndex((t) => (
                            t.url === value.url && t.time === value.time
                        ))
                    )
                    tabdata.Alarms.pop();
                    console.log("Alarms are:",recvmsg);
                    for(var i=0;i<recvmsg.length;i++){
                        tabdata.Alarms.push({url:String(recvmsg[i].url),time:recvmsg[i].time})
                    }
                    tabdata.Alarms = tabdata.Alarms.filter((value, index, self) =>
                        index === self.findIndex((t) => (
                            t.url === value.url && t.time === value.time
                        ))
                    )
                    console.log("Alarmside",recvmsg);
                    console.log(tabdata)
                        chrome.storage.sync.set(tabdata, () => {
                            chrome.storage.sync.get(tabdata, result => {
                                console.log('All values recv from storage', result);
                            });
                        });
                    
                    /*chrome.alarms.create('test',{
                        when:Date.now(),
                        periodInMinutes:0.5
                    })*/
                    alarms=tabdata.Alarms     
                    console.log("alarm fetched",alarms);               
                }
            })
        },5000);
        var recvmsg={}
        chrome.alarms.getAll(function(alarms){
            chrome.alarms.clear(alarms.name);
        })
            
});

chrome.tabs.onActivated.addListener(function(tab){
    hour=0
    minute=0
    second=0
    milliseconds=0
    for(var i=0;i<alarmtime.length;i++){
        if(alarmtime[i].id===tab.tabId){
            hour=alarmtime[i].hours
            minute=alarmtime[i].minutes
            second=alarmtime[i].seconds
        }
    }
    console.log("Alarm Running");
    if(int!==null){
        clearInterval(int);
    }
    int = setInterval(mainTime,10);
    function mainTime(){
        milliseconds+=10;
        if(milliseconds == 1000){
                milliseconds = 0;
                second++;
            if(second == 60){
                second = 0;
                minute++;
                if(minute == 60){
                    minute = 0;
                    hours++;
                }
            }
        }
        let h = hour < 10 ? "0" + hour : hour;
        let m = minute < 10 ? "0" + minute : minute;
        let s = second < 10 ? "0" + second : second;
        let ms = milliseconds < 10 ? "00" + milliseconds : milliseconds < 100 ? "0" + milliseconds : milliseconds;
        
        tabtime.hours=`${h}`;
        tabtime.seconds=`${s}`;
        
        tabtime.minutes= `${m}`;
        tabtime.millisec=`${ms}`
                    
        tabidexists=false;
        for(var i=0;i<alarmtime.length;i++){
            if(alarmtime[i].id===tab.tabId){
                alarmtime[i].hours=parseInt(tabtime.hours);
                alarmtime[i].minutes=parseInt(tabtime.minutes);
                alarmtime[i].seconds=parseInt(tabtime.seconds);
                tabidexists=true;
            }
        }
        if(tabidexists===false){
            alarmtime.push({id:tab.tabId,hours:parseInt(tabtime.hours),minutes:parseInt(tabtime.minutes),seconds:parseInt(tabtime.seconds),alarmfired:false,fire_count:0});
        }
}
    console.log("[alarmtime]Alarm Running time",alarmtime);
});
var thoughts=["You are not a Procrastinator! You're just productive at unimportant things.","Procrastionation: Working tomorrow for a better today.","If there was a pill to cure procrastination, you would probably take it tomorrow.",
    "Procrastination taught us how to do 30 minutes of work in 8 hours and 8 hours of work in 30 minutes.",
    "Nothing makes a person more productive than the last minute.",
    "Work is the greatest thing in the world, so we should always save some of it for tomorrow!",
    "Due tomorrow? Do tomorrow.","If good things come to those who wait. Why is procrastinating bad?",
    "Procrastinator? No. You save all your homework until the last minute because then you’ll be older, and therefore wiser."]


chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){  
    function alarmexec(resalarm){
        console.log("Executing Alarm : ",tabId);
        for(var i=0;i<tabdata.opentabs.length;i++){
            for(var j=0;j<resalarm.length;j++){
                if(resalarm[j].url===tabdata.opentabs[i].url && tabId===tabdata.opentabs[i].id){
                    var alarmid=tabdata.opentabs[i].id;
                    for(var k=0;k<alarmtime.length;k++){
                        var activealarmtime=alarmtime[k].hours*60*60+alarmtime[k].minutes*60+alarmtime[k].seconds
                        if(tabdata.opentabs[i].id===alarmtime[k].id &&  activealarmtime>=resalarm[j].time&& tabId===alarmid){
                            if(!alarmtime[k].alarmfired){
                                console.log("Alarm Fired for ",alarmtime[k].id,resalarm[j].url,activealarmtime,alarmtime[k].fire_count);
                                console.log(tabId,tabdata.opentabs[i]);
                                var alarmname=resalarm[j].url;
                                chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                                    chrome.tabs.sendMessage(tabs[0].id, {content: "Alarm for "+alarmname+"\n"+thoughts[Math.floor(Math.random()*thoughts.length)]});
                                    console.log(tabs[0].id);   
                            });alarmtime[k].fire_count++;
                                    if(alarmtime[k].fire_count>1){
                                        alarmtime[k].alarmfired=true
                                    }
                            }
                        }
                    }
                }
            }
        }
    }
    var alarmflag=setInterval(()=>{
        chrome.storage.sync.get('Alarms',result=>{
            console.log(result.Alarms[0]);
            // alarmsubmit(result.Alarms);
            alarmexec(result.Alarms);
            clearInterval(alarmflag);
        })
    },2000);
});
chrome.storage.sync.get('user_authenticated',result=>{
    console.log(result.user_authenticated);
    tabdata.user_authenticated=result.user_authenticated
})
chrome.extension.onConnect.addListener(function(port) {
    console.log("Connected .....");
    port.onMessage.addListener(function(msg) {
        console.log("message recieved" + msg);
        port.postMessage(tabdata);
    });
})

/*Trash Code
    /*chrome.storage.onChanged.addListener(function (changes, namespace) {
        for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
          console.log(
            `Storage key "${key}" in namespace "${namespace}" changed.`,
            `Old value was "Object.values(${oldValue})", new value is "${newValue}".`
          );
        }
      });*/
    
        /*chrome.alarms.create('test',{
            // when:Date.now(),
            periodInMinutes:1
        })
        chrome.alarms.onAlarm.addListener((alarm)=>{
            if(alarm.name==='test'){
                alert()
            }
        })*/
           /*var arrayWithFilterObjects=[]
            for(var i=0;i<tabdata.Alarms.length;i++){ 
                arrayWithFilterObjects= tabdata.opentabs.filter((o) => o.url === tabdata.Alarms[i].url);
                if(!arrayWithFilterObjects.length){
                    console.log("Tab not active/open");
                }
                else{
                    console.log(arrayWithFilterObjects)
                }
            }
            chrome.alarms.onAlarm.addListener((alarm)=>{    
                if(alarm.name==="www.youtube.com"){
                    console.log("Alarm set");
                    alert(alarm.name+"Alert! You are not a Procrastinator. You seem to be productive at unimportant things.")
                    chrome.notifications.create('test', {
                        type: 'basic',
                        iconUrl: 'back.png',
                        title: 'Alert! You are not a Procrastinator',
                        message: 'You seem to be productive at unimportant things.',
                        priority: 2
                    });
        }
                })*/

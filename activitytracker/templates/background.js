/*var script = document.createElement('script');
script.type = 'text/javascript';
script.src = './jquery-3.1.0.min.js'; // set the source of the script to your script
script.onload = function() {
  console.log("Script is ready!");
    $(document).ready(function() {
    console.log("JQuery is ready!");
  });
};
var head = document.getElementsByTagName("head")[0];
head.appendChild(script);
*/


// var script = document.createElement('script');
// script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
// document.getElementsByTagName('head')[0].appendChild(script);



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
        "opentime":""
    }],
    "closetabs":[{
        "id":"",
        "url":"",
        "closetime":"",
        "totaltime":""
    }],
    "activetime":[{
        "id":"",
        "hours":0,
        "minutes":0,
        "seconds":0,
        "millisec":0
    }]
} 
chrome.tabs.query({windowType:'normal'},function(tabs){
    let [milliseconds,seconds,minutes,hours] = [0,0,0,0];
    let timerRef = document.querySelector('.timerDisplay');
    let int = null;

    
    tabdata.opentabs.pop();
    tabdata.closetabs.pop();
    for(i=0;i<tabs.length;i++){
        if(tabs[i].url!='chrome://newtab/'&&tabs[i].url.includes("file://")===false){
                tabdata.opentabs.push({id:tabs[i].id,url:tabs[i].url,opentime:new Date()});
            }
    }
    console.log(tabdata.opentabs);
    chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
        tabexists=false;
        for(var i=0;i<tabdata.opentabs.length;i++){
            if(tabdata.opentabs[i].id===tab.id && tabdata.opentabs[i].url===tab.url){
                tabexists=true;
            }
        }
        if(tabexists===false){
            var d=new Date();
            if(tab.url!='chrome://newtab/'&&tab.url.includes("file://")===false){
                tabdata.opentabs.push({id:tab.id,url:tab.url,opentime:d});
            }
        }
        console.log(tabdata.opentabs);
    });
    
    chrome.tabs.onRemoved.addListener(function(tab){
        console.log(tab);
        for(var i=0;i<tabdata.opentabs.length;i++){
            if(tabdata.opentabs[i].id===tab){
                var closedate=new Date();
                var totaltime=(closedate-tabdata.opentabs[i].opentime)/1000;
                tabdata.closetabs.push({id:tab,url:tabdata.opentabs[i].url,closetime:new Date(),totaltime:totaltime})
                tabexists=true;
            }
        } 
    });
    chrome.tabs.onActivated.addListener(function(tab){
        for(var i=0;i<tabdata.activetime.length;i++){
            if(tabdata.activetime[i].id===tab.tabId){
                hour=tabdata.activetime[i].hours
                minute=tabdata.activetime[i].minutes
                second=tabdata.activetime[i].seconds
                milliseconds=tabdata.activetime[i].millisec
            }
            else{
                console.log(tab.tabId);
                hour=0
                minute=0
                second=0
                milliseconds=0
            }
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
            /*if(tabidexists===true){
                for(var i=0;i<tabdata.activetime.length;i++){
                    if(tabdata.activetime[i].id===tab.tabId){
                        if(tabdata.activetime[i].millisec == 1000){
                            tabdata.activetime[i].millisec = 0;
                            tabdata.activetime[i].seconds++;
                        if(tabdata.activetime[i].seconds == 60){
                            tabdata.activetime[i].seconds = 0;
                            tabdata.activetime[i].minutes++;
                            if(tabdata.activetime[i].minutes == 60){
                                tabdata.activetime[i].minutes = 0;
                                tabdata.activetime[i].hours++;
                            }
                        }
                    }
                    }
                }    
            }*/
    }
    console.log(tabdata.activetime);
    });
     
    setInterval(function submithandler(){
            console.log("Sending ajax request");
            $.ajax({
                type:"POST",
                url:"http://127.0.0.1:8000/update_tabs/",
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
            /*$.ajax({
                type:"GET",
                url:"http://127.0.0.1:8000/update_tabs/",
                dataType:"text",
                success: function(recvmsg) {
                    tabdata.user_authenticated=recvmsg;
                }
            })*/
        },5000);
        setInterval(function submithandler(){
            $.ajax({
                type:"GET",
                url:"http://127.0.0.1:8000/update_tabs/",
                dataType:"text",
                success: function(recvmsg) {
                    tabdata.user_authenticated=recvmsg;
                    console.log("Receiving ajax request");
                }
            })
        },5000);
    
});

chrome.extension.onConnect.addListener(function(port) {
    console.log("Connected .....");
    port.onMessage.addListener(function(msg) {
        console.log("message recieved" + msg);
        port.postMessage(tabdata);
    });
})

/*Trash Code
// const opent=new Set(tabdata.opentabs)
        // console.log(opent);
        // tabdata.opentabs = cleanopentabs(tabdata.opentabs);


// tabdata.opentabs = tabdata.opentabs.filter((tabdata.opentabs, index, self) => index === self.findIndex((t) => (t.id === tabdata.opentabs.id && t.url === tabdata.opentabs.url)))
        /*const containsuser = !!tabdata.opentabs.find(user => {  
            return (user.id === tabdata.opentabs.id&& user.url===tab.tabdata.opentabsurl)
          });
          console.log(containsuser);
          if(containsuser===false){
            console.log('opentabs updated');
            tabdata.opentabs.push({id:tab.id,url:tab.url})
          }

/*console.log("New tab opened");
        console.log(tab.id+tab.url);
        console.log(tabdata.opentabs);
          


*/
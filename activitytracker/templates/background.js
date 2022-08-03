console.log("Background script is running")
var openTabs = {};
var closeTabs={};
let [milliseconds,second,minute,] = [0,0,0];
let timerRef = document.querySelector('.mainTime');
let int = null;

let tabtime={
    minutes:"",
    seconds:"",
    millisec:""
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

//To Calculate the active time on an active tab
chrome.tabs.query({active:true,currentWindow:true},()=>{
    let [milliseconds,seconds,minutes,hours] = [0,0,0,0];
    let timerRef = document.querySelector('.timerDisplay');
    let int = null;
    chrome.tabs.onActivated.addListener(()=> {
        minute=0
        second=0
        milliseconds=0    
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
                    }
                }
            }
            let m = minute < 10 ? "0" + minute : minute;
            let s = second < 10 ? "0" + second : second;
            let ms = milliseconds < 10 ? "00" + milliseconds : milliseconds < 100 ? "0" + milliseconds : milliseconds;
            // timerRef.innerHTML = ` ${m} : ${s} : ${ms}`;
            // console.log(` ${m} : ${s} : ${ms}`);
            // console.log(`${s}`)
            tabtime.seconds=`${s}`;
            // tabtime.seconds=JSON.stringify(tabtime.seconds);
            tabtime.minutes= `${m}`;
            tabtime.millisec=`${ms}`
            // tabtime.minutes=JSON.stringify(tabtime.minutes);
            // tabtime.millisec=JSON.stringify(tabtime.millisec);
            // console.log(JSON.stringify(tabtime));

        }
    });
});


chrome.tabs.query({windowType:'normal'},function(tabs){
    var tabdata={
        "opentabs":[{
            id:"",
            url:"",
            opentime:"",
            activeopentime:"",
        }],
        "closetabs":[{
            id:"",
            url:"",
            closetime:"",
            activeclosetime:""
        }],
        "activetime":[{}]
    }    
    for(i=0;i<tabs.length;i++){
        console.log(tabs[i].id+tabs[i].url)
        tabdata.opentabs.push({id:tabs[i].id,url:tabs[i].url});
    }
    chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
        console.log("New tab opened");
        console.log(tab.id+tab.url);
        tabdata.opentabs.push({id:tab.id,url:tab.url});
        console.log(tabdata.opentabs);
    })
    chrome.tabs.onRemoved.addListener(function(tab){
        console.log(tab);
        
    })
});


chrome.tabs.query({windowType:'normal'}, function(tabs) {
    console.log('Number of open tabs in all normal browser windows:',tabs);
    for(i=0;i<tabs.length;i++){
        console.log(tabs[i].url);
    }var message="";
    var closingm="";
    var urls = [];
    var closedtaburls="";
    
    console.log('Total Number of open tabs: '+JSON.stringify(tabs.length)+";"+JSON.stringify(tabs));
    chrome.tabs.onActivated.addListener(function(tab) {
        openTabs[tab.tabId] = new Date();   
        console.log("Active tabID is:");
        console.log(tab.tabId);
        console.log(openTabs);
        message+=";Active tabID is: "+JSON.stringify(tab.tabId)+';'+openTabs[tab.tabId];
        
    });
    /*chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        // console.log(changeInfo.url);
        if (changeInfo.url) {
            urls[tabId] = changeInfo.url;
            // console.log(urls[tabId]);
        }
        closedtaburls+=changeInfo.url+";";
        console.log('Closed:',urls[tabId]);
        // console.log(closedtaburls);
    });*/
    chrome.tabs.onRemoved.addListener(function(tab) {   
            closeTabs[tab]=new Date();
            console.log("Tab Closed");
            
            if (openTabs[tab]) {
                console.log("Closed Tab Details");
                console.log(closeTabs);
                console.log((closeTabs[tab]-openTabs[tab])/1000);
                var d=Object.values(closeTabs);
                var maxDate=new Date(Math.max.apply(null,d));
                console.log(maxDate);
                let keys = Object.keys(closeTabs).filter(k=>JSON.stringify(closeTabs[k])===JSON.stringify(maxDate));
                console.log(keys);
                closingm+="Closed Tab Details: ;"+keys+';'+"Close Time: "+maxDate+";"+"Time Active: "+(maxDate-openTabs[tab])/1000+"s"+";";
                delete openTabs[tab];
            }
            console.log(openTabs);
        });

        chrome.extension.onConnect.addListener(function(port) {
            console.log("Connected .....");
            port.onMessage.addListener(function(msg) {
                 console.log("message recieved" + msg);
                 port.postMessage(message+")(*&^%$#@!"+closingm+")(*&^%$#@!"+JSON.stringify(tabtime));
            });
        })

        /*setInterval(function submithandler(){
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
        },10000);*/
});
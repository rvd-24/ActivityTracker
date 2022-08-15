const t= new Set();
var serverhost = 'http://127.0.0.1:8000';
var currTabs="";
chrome.tabs.query({active:true,currentWindow:true},gotTabs);
function gotTabs(tabs){
    console.log("Got tabs");
    t.add(tabs[0].url);
    document.getElementById("tab").innerHTML+=tabs[0].url;
    output=document.getElementById("tab");
    console.log(t);
}
chrome.alarms.create('test',{
    when:Date.now(),
    periodInMinutes:0.1
})
chrome.alarms.onAlarm.addListener((alarm)=>{
    if(alarm.name==='test'){
        chrome.notifications.create('test', {
            type: 'basic',
            iconUrl: 'back.png',
            title: 'Alert! You are not a Procrastinator',
            message: 'You seem to be productive at unimportant things.',
            priority: 2
        });
    }
})

var tabdata={
    "opentabs":[],
    "closetabs":[],
    "activetime":[]
}
var port = chrome.extension.connect({
    name: "Sample Communication"
});
var min=document.getElementById('min')
var sec=document.getElementById('sec');
var res=document.getElementById('res');
var tab=document.getElementById('tab');
var opentime=document.getElementById('opentime');
var closetime=document.getElementById('closetime');
port.postMessage("Hi BackGround");
port.onMessage.addListener(function(msg) {
    var m=msg.split(')(*&^%$#@!');
    var openm="";var closem="";
    openm+=m[0];
    closem+=m[1];
    var tabtime=JSON.parse(m[2])
    console.log(tabtime);
    var tabsurl="";
    console.log(openm);
    openm=openm.split(';');
    console.log(openm.length);
    console.log(openm);
    closem=closem.split(';');
    console.log(closem.length);
    console.log(closem);
    var Tabsobj=JSON.parse(openm[1]);
    for(i=0;i<Tabsobj.length;i++){
        console.log(Tabsobj[i].url);
        tab.innerHTML+="<li>"+Tabsobj[i].url+"\n"+"</li>";
        tabdata.opentabs.push(Tabsobj[i].url);
        // currTabs+=Tabsobj[i].url+"<>";
    }
    min.innerHTML=tabtime.minutes;
    sec.innerHTML=tabtime.seconds;
    const [first]=t;
    console.log(openm[openm.length-1])
    // console.log("message recieved" + msg);
    //res.innerHTML+="Current Tabs"+"<br>"+tabsurl;
    opentime.innerHTML="<h3>Open Tab Details</h3>"+[first][0]+"<br>"+openm[openm.length-2]+"     <br> "+"Tab Open Time: "+openm[openm.length-1];
    if(closem.length<=4){
        closetime.innerHTML="<h3>Closed Tab Details</h3>"+"Closed TabID: "+closem[1]+"<br>     "+closem[2]+"<br>     "+closem[3];
        tabdata.closetabs.push(closem[1]);
        tabdata.activetime.push(closem[3]);
        tab.innerHTML="";
        for(i=0;i<Tabsobj.length;i++){
            if(Tabsobj[i].id!=closem[1])
            {
                tab.innerHTML+="<li>"+Tabsobj[i].url+"\n"+"</li>";
            }
        }   
    }
    else if(closem.length>4){
        closetime.innerHTML="<h3>Closed Tab Details</h3>"+"Closed TabID: "+closem[closem.length-4]+"<br>     "+closem[closem.length-3]+"<br>     "+closem[closem.length-2];
        tabdata.closetabs.push(closem[closem.length-4]);
        tabdata.activetime.push(closem[closem.length-2]);
        tab.innerHTML="";
        for(i=0;i<Tabsobj.length;i++){
            if(Tabsobj[i].id!=closem[closem.length-4])
            {
                tab.innerHTML+="<li>"+Tabsobj[i].url+"\n"+"</li>";
            }
        }
    }for(i=0;i<Tabsobj.length;i++){
        console.log(Tabsobj[i].url);
        //tab.innerHTML+="<li>"+Tabsobj[i].url+"\n"+"</li>";
    }
    console.log(tabdata);

    // const form=document.getElementById("form")
    // form.addEventListener("submit",submithandler);
/*
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
    },10000);
});
// var m=msg.split(';');
//     console.log(m.length);
//     var tabsurl="";
//     var Tabsobj=JSON.parse(m[1]);
//     for(i=0;i<Tabsobj.length;i++){
//         console.log(Tabsobj[i].url);
//         tabsurl+="<li>"+Tabsobj[i].url+"\n"+"</li>";
*/
})
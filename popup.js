const t= new Set();

chrome.tabs.query({active:true,currentWindow:true},gotTabs);
function gotTabs(tabs){
    console.log("Got tabs");
    t.add(tabs[0].url);
    document.getElementById("tab").innerHTML+=tabs[0].url;
    output=document.getElementById("tab");
    console.log(t);
}

var port = chrome.extension.connect({
    name: "Sample Communication"
});

var res=document.getElementById('res');
var opentime=document.getElementById('opentime');
var closetime=document.getElementById('closetime');
port.postMessage("Hi BackGround");
port.onMessage.addListener(function(msg) {
    var m=msg.split(')(*&^%$#@!');
    var openm="";var closem="";
    openm+=m[0];
    closem+=m[1];
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
        tabsurl+="<li>"+Tabsobj[i].url+"\n"+"</li>";
    }var closetabDetails="";
    if(closem[0]===""){
        console.log("No Tab has been closed");
    }
    else{
        closetabDetails=JSON.parse(closem[1]);
        closetabDetails=Object.keys(closetabDetails);
    }
    
    console.log(closetabDetails);
    console.log(openm[openm.length-1])
    // console.log("message recieved" + msg);
    res.innerHTML+=openm[0]+"<br>"+"Current Tabs"+"<br>"+tabsurl;
    opentime.innerHTML="<h3>Open Tab Details</h3>"+openm[openm.length-2]+"      "+"Tab Open Time: "+openm[openm.length-1];
    closetime.innerHTML="<h3>Closed Tab Details</h3>"+"Closed TabID: "+closetabDetails[0]+"<br>     "+closem[2]+"<br>     "+closem[3];
});
// var m=msg.split(';');
//     console.log(m.length);
//     var tabsurl="";
//     var Tabsobj=JSON.parse(m[1]);
//     for(i=0;i<Tabsobj.length;i++){
//         console.log(Tabsobj[i].url);
//         tabsurl+="<li>"+Tabsobj[i].url+"\n"+"</li>";
//     }

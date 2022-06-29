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
port.postMessage("Hi BackGround");
port.onMessage.addListener(function(msg) {
    console.log("message recieved" + msg);
    res.innerHTML+=msg;
});

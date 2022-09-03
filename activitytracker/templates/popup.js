loginbtn=document.getElementById("loginbtn");
registerbtn=document.getElementById("registerlink");
loginbtn.onclick = function () {
    chrome.tabs.create({url: 'http://127.0.0.1:8000/useraccount/login'});
};
registerbtn.onclick=function(){
    chrome.tabs.create({url:'http:/127.0.0.1:8000/useraccount/register'});
}
var port = chrome.extension.connect({
    name: "Extension Communication"
});
port.postMessage("Hi BackGround");
port.onMessage.addListener(function(msg) {
console.log(msg.user_authenticated);
let LoginButton = document.getElementById('loginbtn');

LoginButton.addEventListener('click', function () {
    if(msg.user_authenticated!="not logged in"){
        chrome.browserAction.setPopup({ popup: 'activitytracker/templates/popup2.html' });    
    }
    else if(msg.user_authenticated==""){
        chrome.browserAction.setPopup({popup: 'activitytracker/templates/popup.html'});
    }
});
})
loginbtn=document.getElementById("loginbtn");
registerbtn=document.getElementById("registerlink");
loginbtn.onclick = function () {
    chrome.tabs.create({url: 'http://127.0.0.1:8000/useraccount/login'});
};
registerbtn.onclick=function(){
    chrome.tabs.create({url:'http://127.0.0.1:8000/useraccount/register'});
}
var port = chrome.extension.connect({
    name: "Extension Communication"
});
port.postMessage("Hi BackGround");
port.onMessage.addListener(function(msg) {
console.log(msg.user_authenticated.length);
let LoginButton = document.getElementById('loginbtn');
if(msg.user_authenticated.length===0){
    chrome.browserAction.setPopup({ popup: 'templates/popup.html' });    
}
else{
    if(msg.user_authenticated==="not logged in"){
        chrome.browserAction.setPopup({ popup: 'templates/popup.html' });    
    }
    else{
        chrome.browserAction.setPopup({ popup: 'templates/popup2.html' });    

    }
}
LoginButton.addEventListener('click', function () {
    if(msg.user_authenticated.length===0){
        chrome.browserAction.setPopup({ popup: 'templates/popup.html' });    
    }
    else{
        if(msg.user_authenticated==="not logged in"){
            chrome.browserAction.setPopup({ popup: 'templates/popup.html' });    
        }
        else{
            chrome.browserAction.setPopup({ popup: 'templates/popup2.html' });   
        }
    }
});
})
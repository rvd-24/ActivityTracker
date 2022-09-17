chrome.runtime.onMessage.addListener(function(message){
    res=Object.values(message);
    alert(res);
    return true;
});
console.log("Background script is running")
var openTabs = {};
var closeTabs={};

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }
chrome.tabs.query({windowType:'normal'}, function(tabs) {
    console.log('Number of open tabs in all normal browser windows:',tabs);
    for(i=0;i<tabs.length;i++){
        console.log(tabs[i].url);
    }var message="";
    var closingm="";
    message+='Total Number of open tabs: '+JSON.stringify(tabs.length)+";"+JSON.stringify(tabs);
    chrome.tabs.onActivated.addListener(function(tab) {
        openTabs[tab.tabId] = new Date();   
        console.log("Active tabID is:");
        console.log(tab.tabId);
        //console.log(tab.url);
        console.log(openTabs);
        message+=";Active tabID is: "+JSON.stringify(tab.tabId)+';'+openTabs[tab.tabId];
    });
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
                 port.postMessage(message+")(*&^%$#@!"+closingm);
            });
        })
         
});
/*chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    console.log(tabs[0].url);
});*/
// var openTabs = {};
// chrome.tabs.onActivated.addListener(function(tab) {
//     openTabs[tab.id] = new Date();
//     console.log(tab.id);
// });


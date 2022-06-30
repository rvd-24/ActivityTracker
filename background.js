console.log("Background script is running")
var openTabs = {};
var closeTabs={};

chrome.tabs.query({windowType:'normal'}, function(tabs) {
    console.log('Number of open tabs in all normal browser windows:',tabs);
    for(i=0;i<tabs.length;i++){
        console.log(tabs[i].url);
    }var message="";
    var closingm="";
    message+='Number of open tabs in this window: '+JSON.stringify(tabs.length)+";"+JSON.stringify(tabs);
    chrome.tabs.onActivated.addListener(function(tab) {
        openTabs[tab.tabId] = new Date();   
        console.log("Active tabID is:");
        console.log(tab.tabId);
        //console.log(tab.url);
        console.log(openTabs);
        message+=";Active tabID is: "+JSON.stringify(tab.tabId)+';'+JSON.stringify(openTabs[tab.tabId]);
    });
    chrome.tabs.onRemoved.addListener(function(tab) {   
            closeTabs[tab]=new Date();
            console.log("Tab Closed");
            
            if (openTabs[tab]) {
                console.log("Closed Tab Details");
                console.log(closeTabs);
                console.log((closeTabs[tab]-openTabs[tab])/1000);
                closingm+="Closed Tab Details: "+JSON.stringify(closeTabs)+';'+"Close Time: "+JSON.stringify(closeTabs[tab])+";"+"Time Active: "+(closeTabs[tab]-openTabs[tab])/1000;
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


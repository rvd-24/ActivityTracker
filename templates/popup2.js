var tabdetailsbtn=document.getElementById("tabdetails");
tabdetailsbtn.onclick=function(){
   chrome.tabs.create({url:'http://127.0.0.1:8000/useraccount/login'});
}
var port = chrome.extension.connect({
   name: "Extension Communication"
});
port.postMessage("Hi BackGround");
port.onMessage.addListener(function(msg) {
console.log("User:",msg.user_authenticated);
var opentabs=msg.opentabs
var closetabs=msg.closetabs;
var activetime=msg.activetime;
var openturl=msg.opentabs;
console.log(opentabs);
console.log(closetabs);
console.log(activetime);
var tab=msg.opentabs;
activetime.splice(0,1);
var opent=document.getElementById("opentab");
for(var i=0;i<tab.length;i++){
   for(var j=0;j<closetabs.length;j++){
      if(closetabs[j].id===tab[i].id){
         tab.splice(i,1)
      }
   }
}

console.log(openturl);
console.log("open",opentabs);
console.log("close",closetabs);
var txt=""
console.log("tab",tab);
for(var i=0;i<opentabs.length;i++){
   for(var j=0;j<activetime.length;j++){ 
      if(opentabs[i].id===activetime[j].id){
            /*if(opentabs[i].url.includes("https://")){
               tab[i].url=opentabs[i].url;
               opentabs[i].url=opentabs[i].url.slice(8,28);
            }
            else if(opentabs[i].url.includes("http://")){
               tab[i].url=opentabs[i].url;
               opentabs[i].url=opentabs[i].url.slice(7,28);
            }*/
            var taburl=opentabs[i].url;
         txt+="<br><div class='current'>"+"<p title='"+opentabs[i].fullurl+"' id='name'>"+taburl+"</p>"+"<p id='time'>"+activetime[j].hours+"h&nbsp;"+activetime[j].minutes+"m&nbsp;"+activetime[j].seconds+"s</p>"+"</div>";
         opent.innerHTML=txt;
      }      
   }
} 

const labels = [];
for(var i=0;i<opentabs.length;i++){
   labels.push(opentabs[i].url);
}

console.log("labels",opentabs);
time=[]
const value=[];
var sec=0
for(var i=0;i<opentabs.length;i++){
   for(var j=0;j<activetime.length;j++){
      if(activetime[j].id===opentabs[i].id){
         sec=activetime[j].seconds+60*activetime[j].minutes+60*60*activetime[j].hours;
         time.push({sec:sec,id:activetime[j].id});
         value.push(sec);
      }
   }  
}
for(var i=0;i<closetabs.length;i++){
   for(var j=0;j<activetime.length;j++){
      if(activetime[j].id===closetabs[i].id){
         sec=activetime[j].seconds+60*activetime[j].minutes+60*60*activetime[j].hours;
         time.push({sec:sec,id:activetime[j].id});
         value.push(sec);
      }
   } 
}
var totaltime=0
for(var i=0;i<activetime.length;i++){
   totaltime+=activetime[i].seconds+60*activetime[i].minutes+60*60*activetime[i].hours;
}
var todaytime=document.getElementById("todaytime");
var todayh=parseInt(totaltime/(60*60))
var todaym=parseInt((totaltime-(3600*todayh))/60)
todaytime.innerHTML=todayh+"h&nbsp;&nbsp;"+todaym+"m"
console.log(value);
console.log("time",time);
const data = {
  labels: labels,
  datasets: [{
  label: 'Usage',
  backgroundColor: ["#2E8EFF", "#E8AC12", "#EC2525", "#95C6FF", "#FFDE8A", "#FFADAD"], 
  data:value
  }]
};

const config = {
  type: 'bar',
  data: data,
  options: {
     scales: {
        x: {
           grid: {
              display: false
           }
        },
        y: {
           grid: {
              display: false
           }
     }
  }
}
};
const myChart = new Chart(document.getElementById('myChart'),config);
});

var today=new Date();
var dd = today.getDate()
var mm = today.getMonth() + 1
var months=new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
document.getElementById("date").innerHTML=dd+' '+months[mm];

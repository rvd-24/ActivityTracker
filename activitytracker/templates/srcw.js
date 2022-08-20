setInterval(function submithandler(){
    console.log("Receiving ajax request");
    /*$.get("http://127.0.0.1:8000/sendchartdata/", function(data, status){
        console.log("Data: " + JSON.stringify(data) + "\nStatus: " + status);
      });*/
    $.ajax({
        type:"GET",
        url:"http://127.0.0.1:8000/sendchartdata/",
        dataType:"json",
        success: function(recvmsg) {
            var chart;
            var data;
            console.log(recvmsg);
            google.charts.load('current',{
                callback:drawChart,
                packages:['corechart']
            });
            function drawChart(){
                var tabdata=recvmsg;
                data=new google.visualization.DataTable();
                data.addColumn('string','URL');
                data.addColumn('number','seconds');
                data.addColumn('number','minutes');
                for(var i=1;i<tabdata.activetime.length;i++){
                    for(var j=0;j<tabdata.opentabs.length;j++){
                        if(tabdata.activetime[i].id===tabdata.opentabs[j].id){
                            data.addRow([
                                tabdata.opentabs[j].url,parseInt(tabdata.activetime[i].seconds),parseInt(tabdata.activetime[i].minutes)
                            ]);
                        }
                    }
                    
                }
                var options = {
                    title: 'Pie Chart',
                    width: 600,
                    height: 600,
                    responsive:true
                };

                chart = new google.visualization.PieChart(document.getElementById('chart_div'));
                google.visualization.events.addListener(chart, 'select', selectHandler);
                chart.draw(data, options);
                }
                google.charts.setOnLoadCallback(drawChart1);
                function drawChart1() {
                    var data = google.visualization.arrayToDataTable([
                        ['Task', 'Hours per Day'],
                        ['vtop.com',18],
                        ['youtube.com',16],
                        ['netflix.com',13],
                        ['Others',10]
                    ]);

                    var options = {
                        colors: ['#65CA78', '#DE6262', '#5BC4FA', '#F6C06D'],
                        is3D: true,
                        title: 'Pie Chart',
                        width: 600,
                        height: 600,
                        responsive:true
                    };

                    var chart = new google.visualization.PieChart(document.getElementById('piechart1_3d'));
                    chart.draw(data, options);
                }
                function selectHandler() {
                // be sure something is selected
                if (chart.getSelection().length) {
                    var selectedItem = chart.getSelection()[0];
                    var value = data.getValue(selectedItem.row, 0);
                    alert('The user selected ' + value);
                }
                }
                window.onresize=function(){
                    drawChart();
                    drawChart1();
                };
            },
        error: function(){
            console.log("json not found");
        }
    })
},3000);

var s1=document.getElementById("val1").innerHTML;
var s2=document.getElementById("val2").innerHTML;
if(s1[0]==="+"){
    document.getElementById("val1").style.color="#5ECA2C";
    document.getElementById("g1").src="increase.png"
}
else{
    document.getElementById("val1").style.color="#F95050";
    document.getElementById("g1").src="decrease.png"
}
if(s2[0]==="+"){
    document.getElementById("val2").style.color="#5ECA2C";
    document.getElementById("g2").src="increase.png"
}
else{
    document.getElementById("val2").style.color="#F95050";
    document.getElementById("g2").src="decrease.png"
}


var myEl = document.getElementById('drop1');
myEl.addEventListener('click', function () {
    if (document.getElementById("drop1ele").style.display==="block"){
        document.getElementById("drop1ele").style.display="none";
        document.getElementById("arrow1").style.transform="none";
    }
    else{
        document.getElementById("drop1ele").style.display="block";
        document.getElementById("arrow1").style.transform="rotate(180deg)";
    }
});

const myEl2 = document.getElementById('drop2');
myEl2.addEventListener('click', function () {
    if (document.getElementById("drop2ele").style.display==="block"){
        document.getElementById("drop2ele").style.display="none";
        document.getElementById("arrow2").style.transform="none";
    }
    else{
        document.getElementById("drop2ele").style.display="block";
        document.getElementById("arrow2").style.transform="rotate(180deg)";
    }
});

function change(){
    if(document.getElementById("gopt1").innerHTML==="Today"){
        document.getElementById("gopt1").innerHTML="This week";
        document.getElementById("gopt2").innerHTML="Today";
        document.getElementById("piechart_3d").style.display="none";
        document.getElementById("piechart1_3d").style.display="block";
        document.getElementById("graphhead").innerHTML="Week Activity";
        drawChart1();
    }
    else{
        document.getElementById("gopt1").innerHTML="Today";
        document.getElementById("gopt2").innerHTML="This week";
        document.getElementById("piechart_3d").style.display="block";
        document.getElementById("piechart1_3d").style.display="none";
        document.getElementById("graphhead").innerHTML="Today's Activity";
        drawChart();
    }
}
function change1(){
    if(document.getElementById("mopt1").innerHTML==="Today"){
        document.getElementById("mopt1").innerHTML="This week";
        document.getElementById("mopt2").innerHTML="Today";
        document.getElementById("list1").style.display="none";
        document.getElementById("list2").style.display="flex";
    }
    else{
        document.getElementById("mopt1").innerHTML="Today";
        document.getElementById("mopt2").innerHTML="This week";
        document.getElementById("list1").style.display="flex";
        document.getElementById("list2").style.display="none";
    }
}
/*google.charts.load("current", {packages:["corechart"]});
google.charts.setOnLoadCallback(drawChart);
function drawChart() {
    var data = google.visualization.arrayToDataTable([
        ['Task', 'Hours per Day'],
        ['vtop.com',5],
        ['youtube.com',4],
        ['netflix.com',3],
        ['Others',2]
    ]);

    var options = {
        colors: ['#65CA78', '#DE6262', '#5BC4FA', '#F6C06D'],
        is3D: true,
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart_3d'));
    chart.draw(data, options);
}
google.charts.setOnLoadCallback(drawChart1);
function drawChart1() {
    var data = google.visualization.arrayToDataTable([
        ['Task', 'Hours per Day'],
        ['vtop.com',18],
        ['youtube.com',16],
        ['netflix.com',13],
        ['Others',10]
    ]);

    var options = {
        colors: ['#65CA78', '#DE6262', '#5BC4FA', '#F6C06D'],
        is3D: true,
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart1_3d'));
    chart.draw(data, options);
}
window.onresize=function(){
    drawChart();
    drawChart1();
};*/
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
                /*Object.keys(tabdata[0]).forEach(function (key) {
                    Object.keys(tabdata[2].forEach)
                    data.addRow([
                        key,
                        parseFloat(results[0][key])
                    ]);
                    });
                
                    */
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

                function selectHandler() {
                // be sure something is selected
                if (chart.getSelection().length) {
                    var selectedItem = chart.getSelection()[0];
                    var value = data.getValue(selectedItem.row, 0);
                    alert('The user selected ' + value);
                }
                }
            },
        error: function(){
            console.log("json not found");
        }
    })
},3000);

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
    responsive:true
};

var chart = new google.visualization.PieChart(document.getElementById('piechart_3d'));
chart.draw(data, options);
}
window.onresize = resizeChart;
function resizeChart() {
  //do a load of stuff
  drawChart();
}*/
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

const myEl = document.getElementById('drop1');
myEl.addEventListener('click', function () {
    if (document.getElementById("drop1ele").style.display==="none"){
        document.getElementById("drop1ele").style.display="block";
        document.getElementById("arrow1").style.transform="rotate(180deg)";
    }
    else{
        document.getElementById("drop1ele").style.display="none";
        document.getElementById("arrow1").style.transform="none";
    }
});

const myEl2 = document.getElementById('drop2');
myEl2.addEventListener('click', function () {
    if (document.getElementById("drop2ele").style.display==="none"){
        document.getElementById("drop2ele").style.display="block";
        document.getElementById("arrow2").style.transform="rotate(180deg)";
    }
    else{
        document.getElementById("drop2ele").style.display="none";
        document.getElementById("arrow2").style.transform="none";
    }
});
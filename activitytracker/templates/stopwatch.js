chrome.tabs.query({active:true,currentWindow:true},()=>{
    let [milliseconds,seconds,minutes,hours] = [0,0,0,0];
    let timerRef = document.querySelector('.timerDisplay');
    let int = null;
    chrome.tabs.query({active:true,currentWindow:true},()=>{
        if(int!==null){
            clearInterval(int);
            }
            int = setInterval(mainTime,10);
            function mainTime(){
                milliseconds+=10;
                if(milliseconds == 1000){
                        milliseconds = 0;
                        second++;
                    if(second == 60){
                        second = 0;
                        minute++;
                        if(minute == 60){
                            minute = 0;
                        }
                    }
                }
                let m = minute < 10 ? "0" + minute : minute;
                let s = second < 10 ? "0" + second : second;
                let ms = milliseconds < 10 ? "00" + milliseconds : milliseconds < 100 ? "0" + milliseconds : milliseconds;
                timerRef.innerHTML = ` ${m} : ${s} : ${ms}`;
                // console.log(` ${m} : ${s} : ${ms}`);
            }
    });  
});

console.clear()
isStop=true
var s=0;
var m=0;
var h=0;
function start(){
   if(isStop==true){
      isStop=false;
      timer()

   }
}
function timer(){
  s=parseInt(s)
  m=parseInt(m)
  h=parseInt(h)
  if(isStop==false){

    if(s==60){
      s=0;
      m++;
     
    }
    if(m==60){
      m=0;
      h++
    }
    
    let formattedS=s<10? "0"+s:s;
    let formattedM=m<10? "0" + m : m;
    let formattedH=h<10? "0" + h:h;

    StopWatch.innerHTML=formattedH + " : " + formattedM + " : " + formattedS;

    s++
    setTimeout("timer()",1000)
  }
}





function stop(){

isStop=true;

}


function reset(){
s=0;
m=0;
h=0;

StopWatch.innerHTML="00 : 00 : 00"
}



// function reset(){



// }
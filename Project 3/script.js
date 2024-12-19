function calculateAge(){
  let day;
  let month;
  let year;

  let currentDay=parseInt(current.value.slice(8,10),10);
  let currentMonth=parseInt(current.value.slice(5,7),10);
  let currentYear=parseInt(current.value.slice(0,4),10);
  console.log(currentDay,currentMonth,currentYear)

  let birthDay=parseInt(Birth.value.slice(8,10),10);
  let birthMonth=parseInt(Birth.value.slice(5,7),10);
  let birthYear=parseInt(Birth.value.slice(0,4),10);
  console.log(birthDay,birthMonth,birthYear);


  if(currentDay>=birthDay){
    day=currentDay-birthDay;
  }else{
    const previousMonth = new Date(currentYear, currentMonth - 1, 0);
    day = currentDay + previousMonth.getDate() - birthDay;
    currentMonth--;
  }

  if(currentMonth>=birthMonth){
    month=currentMonth-birthMonth;
  }else{
    month=currentMonth+12-birthMonth;
  }

  year=currentYear-birthYear;

  if(year<0){
    age.innerHTML='Please enter valid date'
  }
  else{
    age.innerHTML=year+' years '+month+' months '+day+' days'
  }
}

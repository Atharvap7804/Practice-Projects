const input=document.getElementById('city')
const button=document.getElementById('getWeather')
const cityName=document.getElementById('cityName')
const temp=document.getElementById('temp')
const condition=document.getElementById('condition')
const time=document.getElementById('time')
const region=document.getElementById('region')
const country=document.getElementById('country')

async function getData(cityName){
  const URL=await fetch(`http://api.weatherapi.com/v1/current.json?key=2b581c829f6c466c9d1153149253004&q=${cityName}&aqi=yes`)

  return await URL.json()
}

button.addEventListener('click',async()=>{
  const value=input.value
  const data=await getData(value)

 cityName.innerText=`City : ${data.location.name}`

 region.innerText=`Region : ${data.location.region}`

 country.innerText=`Country : ${data.location.country}`

 temp.innerText=`${data.current.temp_c}°C`

 time.innerText=`Time : ${data.location.localtime}`

 condition.innerText=`Condition : ${data.current.condition.text}`

  console.log(data)
})
export const getDateArray = function(start, end) {
  var
    arr = new Array(),
    dt = new Date(start);

  while (dt <= end) {
    arr.push(new Date(dt));
    dt.setDate(dt.getDate() + 1);
  }
  return arr;
}

export const getPeopleArray = function(data) {
  let people_array = [];
  data.forEach(element => {
    if(element.lesson_type === 'private'){
      people_array.push(element.name);
    }
  });
  return people_array;
}

const getMaxDayPrice = function(days){
  let numbers = days?.map(day=>{
    let key = Object.keys(day)[0]?.split('_')[1];
    if(key != 'plus'){ return parseInt(key)}else{
      return 0;
    };
  })
  let maxValue = Math.max(...numbers);
  let maxPrice = 0
  days?.forEach(day=>{
    let key = Object.keys(day)[0]?.split('_')[1];
    if(key == maxValue){
      maxPrice = Object.values(day)[0];
    }
  })
  return {day:maxValue,price:maxPrice};
}

const getPlusDayPrice = function(days){
  let plusPrice = 0;
  days?.forEach(day=>{
    let key = Object.keys(day)[0]?.split('_')[1];
    if(key == 'plus'){
      plusPrice = Object.values(day)[0];
    }
  })
  return plusPrice
}

export const getDaysPrice = function(total,days){
  console.log("Days",days)
  if(days === undefined) return 0;
  if(days.length === 0) return 0;
  let price = 0;
  let found = false;
  days?.forEach((day)=>{
    let obj = Object.keys(day)[0];
    let number =  obj.split('_')[1];
    if(number == total){
      price = Object.values(day)[0];
      found = true;
    }
  })
  if(found) return price;
  let plusPrice = getPlusDayPrice(days);
  let maxDay =  getMaxDayPrice(days);
  let extraDays = total - maxDay.day;
  console.log("Extra days", extraDays, 'plus price',plusPrice)
  return (plusPrice * extraDays) + parseFloat(maxDay.price);
}
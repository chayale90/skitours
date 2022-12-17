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
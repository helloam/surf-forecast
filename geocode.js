// this uses open weather api to get the coordinates for the searched places
var input = 'San Francisco';
var lon = '';
var lat = '';

fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input}&units=imperial&appid=deaeafb532c77ef1da766b428ecb34ef`, {
    method: 'GET'
})
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
    lon = data.coord.lon;
    console.log(lon);
    lat = data.coord.lat;
    console.log(lat);
  });
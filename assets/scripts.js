// wave height api
fetch('https://api.stormglass.io/v2/weather/point?lat=36.960864&lng=122.024767&params=waveHeight&source=noaa', {
    method: 'GET',
    headers: {
        'Authorization':'00522cd6-a88d-11eb-8d12-0242ac130002-00522d4e-a88d-11eb-8d12-0242ac130002'
    }
})
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  });












  

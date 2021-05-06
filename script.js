// global variables
var date = moment().format('MMMM Do YYYY');
var apiKey = '8942145ec40dc1f3c1818b604a2982d4';
var locationEl = $('.location');
var tempEl = $('.main-temp');
var hiEl = $('.high');
var lowEl = $('.low');
var dateEl = $('#date');
var lat = '';
var lon = '';


function getWeather(city) {
   var weatherURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial' + '&appid=8942145ec40dc1f3c1818b604a2982d4';
   $.ajax({
       url: weatherURL,
       method: 'GET',
   }).then(function (weatherResponse) {
       weather = weatherResponse;
       var temp = (weather.main.temp).toFixed(0);
      // icons
       var icon = weatherResponse.weather[0].icon;
       document.getElementById('image-icon').src = `./images/icons/${icon}.png`;

   // removed the date from here
       locationEl.text(weather.name);
   // added the date here
       dateEl.text(date);
      // removed the word temperture 
       tempEl.text(temp + '°F');
      // fixed the high weather
       hiEl.text(weather.main.temp_max.toFixed(0) + '°');
      // fixed the low weather
       lowEl.text(weather.main.temp_min.toFixed(0) + '°');

       lat = weather.coord.lat;
       lon = weather.coord.lon;
       fetchStormglassData(lat,lon);
       })
   }

   // search button 
$('#search-btn').on('click', function (event) {
   // event.preventDefault();
   var city = $('#search-bar').val().trim();
   var citiesSearched = JSON.parse(localStorage.getItem('citiesSearched'));
   if (citiesSearched == null) {
       citiesSearched = [];
   }
   citiesSearched.unshift(city);
   var citiesPast = localStorage.setItem('citiesSearched', JSON.stringify(citiesSearched));
   addCityButton(city);
})

/*Function to create and display buttons for each location searched. TO-DO:
write a function to clear values/reset search upon reload or something*/
function addCityButton(city) {
   var newSearch = $('<tr id="previousSearch">');
   var cityButton = $('<button id=' + city + ' class=btn>');
   var btnIcon = $('<i class="fas fa-map-pin icon"></i>');
   var cityName = $('<p class city-text></p>').text(city);
   // added the map icon back
   newSearch.append(cityButton);
   cityButton.append(btnIcon);
   btnIcon.append(cityName);
   cityButton.on('click', function (event) {
      event.preventDefault();
      getWeather(city);
   })
   $('#cityButton').prepend(newSearch);
}


window.onload = function () {
   var citiesPast = JSON.parse(localStorage.getItem('citiesSearched'));
   if (citiesPast == null) {
       citiesPast = [];
   }

   for (i = 0; i < citiesPast.length; i++) {
       if (citiesPast[i] != null) {
           addCityButton(citiesPast[i]);
       }
   }

   if (citiesPast.length > 0) {
       getWeather(citiesPast[0]);
   }
}

////////////Start of Stormglass API for getting wave height.///////////////
var displayStormglassData = function (fetchedData) {
   var waveHeightEl = $('.wave-height');
   // displays wave height
   for (let i = 0; i < waveHeightEl.length; i++) {
      waveHeightEl[i].textContent = fetchedData.hours[i].waveHeight.noaa + 'ft';
   }

   var timeTableEl = $('.time');
   // displays time
   for (let i = 0; i < timeTableEl.length; i++) {
   timeTableEl[i].textContent = moment().add(i , 'h').format('h a');
   }
};


var fetchStormglassData = function (lat, lon) {
   // Converts time to unix timestamp
   var currentTime = moment().unix();
   // adds 6 hours to current time 
   var endTime = moment().add(6, 'h').unix();
   // fetch the stormglass api
   var params = "waveHeight";
   apiKey = "07a15aca-a88d-11eb-9cd1-0242ac130002-07a15b42-a88d-11eb-9cd1-0242ac130002"

   fetch(`https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lon}&params=${params}&start=${currentTime}&end=${endTime}&source=noaa`, {
      headers: {
         'Authorization': apiKey
      }
   }).then((response) => {
      if (response.ok) {
         response.json().then((jsonData) => {
            displayStormglassData(jsonData);
         });
      }
      else {
         document.querySelector(".wave-report").style.display = "flex";
      };
   });
};
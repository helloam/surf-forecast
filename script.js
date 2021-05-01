///stormGlass Api will return wave height and water temps for provided lat and long
//const CastUrl = "https://api.stormglass.io/v2/";
//const key = "07a15aca-a88d-11eb-9cd1-0242ac130002-07a15b42-a88d-11eb-9cd1-0242ac130002";
$(document).ready(function () {
    $('select').formSelect();
 
    // array to hold location info for the beach options
    var surfspot = [
       { name: "Surf Spot" },
       { name: "Santa Cruz", lat: 34.021802, lng: -118.831190 },
       { name: "Pacifica", lat: 34.024212, lng: -118.496475 },,
       { name: "Asilomar State Beach", lat: 33.660057, lng: -117.998970 },
       { name: "Newport Beach", lat: 33.628342, lng: -117.927933 },
    ];
 
    ////////////////////////////////////
 
    var parseAndDisplayStormglassData = function (fetchedData) {
       var airTemp = fetchedData.hours[0].airTemperature.noaa;
       // Convert from celcius to fahrenheit and round to 2 decimal places
       airTemp = ((airTemp * (9 / 5)) + 32).toFixed(2);
       $("#airTemp").html("<p class='black-text'>Air Temp</p>" + airTemp + " °F");

 
       var waveDirection = fetchedData.hours[0].waveDirection.noaa;
       $("#waveDirection").text(getDirection(waveDirection) + " " + waveDirection + "°");
 
       var waveHeight = fetchedData.hours[0].waveHeight.noaa;
       // Convert waveHeight from meters to feet and round to 2 decimal places
       waveHeight = (waveHeight * 3.281).toFixed(2);
       $("#waveHeight").text(waveHeight + "ft");

 
    };
 
    ////////////////////////////////////
 
    // Fetch Gifs from Giphy Analyze weather data and display surf conditions with Gif and Descriptive Heading
 
   var fetchGifs = function (fetchedData) {
       var surfConditions = "";
 
       // pull data used to determine surf conditions
       var windData = fetchedData.hours[0].windSpeed.noaa;
 
       var swellData = fetchedData.hours[0].swellHeight.noaa;
 
       var waveData = fetchedData.hours[0].waveHeight.noaa;
 
       var waveRatio = swellData / waveData;
 
       // analyze data to compare with my own definitions of surf conditions and display findings
       if (windData > 8.2) {
          surfConditions = "Strong Surf";
       } else if (windData > 6.69 && windData < 8.2 && waveRatio < .5) {
          surfConditions = "Poor Surf";
       } else if (waveData < .6) {
          surfConditions = "Ok Surf"
       } else {
          // return "Good Surf";
          surfConditions = "Good Surf";
       }
 
       let off = Math.floor(Math.random() * 20 + 1);
 
       // pull gifs with key word coming from the surf conditions algorhythm and post to gif container on page
       fetch(
          `https://api.giphy.com/v1/gifs/search?q=' +
          ${surfConditions} +
          '&api_key=Bp3XvQZse87d1YsB5T7Cpl5akJIKvcNg&limit=1&offset=${off}`
       )
 
          .then(function (response) {
             if (response.ok) {
                return response.json();
             } else {
                throw new Error('Something went wrong');
             }
          })
          .then(function (response) {
             var responseContainerEl = document.querySelector('#giphy');
 
             responseContainerEl.innerHTML = "";
 
             var gifImg = document.createElement('img');
             gifImg.setAttribute('src', response.data[0].images.fixed_height.url);
 
             responseContainerEl.appendChild(gifImg);
 
          })
          .catch((error) => {
             console.log(error)
          });
 
       // display surf conditions description and append to page
 
       let conditionsHeadingEl = document.querySelector("#surf-description");
 
       conditionsHeadingEl.innerHTML = surfConditions;
 
       //let conditionsDescription = surfConditions;
       //conditionsHeadingEl.appendChild(surfConditions);
    };
 
    ////////////////////////////////////
 
    let fetchStormglassData = function (lat, lng) {
 
       // Convert time to UTC time, required to pass into the fetch parameter
       let todayInUtcTime = Math.floor((new Date().getTime()) / 1000);
 
       ///////////////////////////////////////////////////
       // Uncomment these two lines to test fetch error //
       ///////////////////////////////////////////////////
       //lat = 3333.5705796;
       //lng = -1173.8108887;
 
       const params = "windSpeed,waterTemperature,windDirection,airTemperature,waveHeight,waveDirection,wavePeriod,swellDirection,swellHeight,swellPeriod";
       apiKey = "07a15aca-a88d-11eb-9cd1-0242ac130002-07a15b42-a88d-11eb-9cd1-0242ac130002"
 
       fetch(`https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}&start=${todayInUtcTime}&end=${todayInUtcTime}&source=noaa`, {
          headers: {
             'Authorization': apiKey
          }
       }).then((response) => {
          if (response.ok) {
             response.json().then((jsonData) => {
                parseAndDisplayStormglassData(jsonData);
 
                // push data from stormglass api call to gif function.  and call function.  
 
                fetchGifs(jsonData);
             });
          }
          else {
             document.querySelector(".modal-bg").style.display = "flex";
          };
       });
    };
 
    ///////////////////////////////////////
    // event listener for beach selection 
    ///////////////////////////////////////
    var beachSelect = document.querySelector('#select');
 
    beachSelect.addEventListener("change", function (event) {
       // set variable for index value of selection
       let selection = document.getElementById("select").value;
 
       // change the lat and lng variables to correspond with the selected beach
       var lat = surspot[event.target.value].lat;
       var lng = surfspot[event.target.value].lng;
       var beachName = surftown[event.target.value].name;
       
       // save last search option value and lat lng in local.storage
       localStorage.setItem("last-beach-name", beachName);
       localStorage.setItem("last-selection", selection);
       localStorage.setItem("last-lat", lat);
       localStorage.setItem("last-lng", lng);
       // fetchStormglass with the new lat and lng parameters 
       fetchStormglassData(lat, lng);
       // change h2 innerhtml to display beach name
       document.getElementById("current-beach").innerHTML = beachName;
 
    });
 
    //////////////////////////////////
    // Pull values from local storage and display last selected beach upon reload.
    //////////////////////////////////
 
    if (localStorage.getItem("last-selection")) {
       // set "Select beach" default option's attribute of selected to "false".
       let deafaultOpt = document.getElementById("default");
       deafaultOpt.setAttribute("selected", "false");
 
       // set the value of the selected option to equal the last selection value in local storage.
       beachSelect.selectedIndex = localStorage.getItem("last-selection");
       lat = localStorage.getItem("last-lat");
       lng = localStorage.getItem("last-lng");
 
       // set the currently selected beach to a variable and add attribute of selected true
       let lastSelection = beachSelect.options[beachSelect.selectedIndex];
       lastSelection.setAttribute("selected", "true");
 
       fetchStormglassData(lat, lng);
 
       document.getElementById("current-beach").innerHTML = localStorage.getItem("last-beach-name");
    } else {
       beachSelect.selectedIndex = "-1";
    }
 
    // When the user clicks on the X to close the fetch error modal
    document.querySelector(".modal-close").addEventListener("click", function () {
       document.querySelector(".modal-bg").style.display = "none";
    });
 });
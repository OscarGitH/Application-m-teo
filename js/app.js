document.addEventListener('DOMContentLoaded', (event) => {
  const submitButton = document.getElementById('submitButton');
  const path = window.location.pathname;
  const page = path.split("/").pop();
  if (page !== "index.html") {
    const searchBar = document.getElementById("cityInput");

    searchBar.disabled = true;
    submitButton.disabled = true;
    searchBar.style.display = "none";
    submitButton.style.display = "none";
  } else {
    submitButton.addEventListener('click', function (event) {
      event.preventDefault();

      handleFormSubmission();
    });

    document.getElementById('cityInput').value = "Paris";

    handleFormSubmission();
  }
});

function handleFormSubmission() {
  var cityInput = document.getElementById('cityInput').value;

  if (!cityInput) {
    alert('Please enter a city');
    return;
  }

  var url = 'http://api.openweathermap.org/data/2.5/weather?q=' + cityInput + '&appid=ee07e2bf337034f905cde0bdedae3db8';
  var xhr = new XMLHttpRequest();

  xhr.addEventListener('load', function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      var response = JSON.parse(xhr.responseText);
      displayWeatherData(response, cityInput);
    } else {
      console.error('The request failed with status code ' + xhr.status);
    }
  });

  xhr.addEventListener('error', function () {
    console.error('A network error occurred');
  });

  xhr.addEventListener('timeout', function () {
    console.error('The request timed out');
  });

  xhr.open('GET', url, true);
  xhr.send();
}

function displayWeatherData(weatherData, cityInput) {
  var cityName = cityInput;
  var temperature = Math.round(weatherData.main.temp - 273.15);
  var feelsLike = Math.round(weatherData.main.feels_like - 273.15);
  var minTemp = Math.round(weatherData.main.temp_min - 273.15);
  var maxTemp = Math.round(weatherData.main.temp_max - 273.15);
  var weatherDescription = weatherData.weather[0].description;
  var windSpeed = Math.round(weatherData.wind.speed * 3.6);
  var pressure = weatherData.main.pressure;
  var humidity = weatherData.main.humidity;
  var sunRise = new Date();
  sunRise.setTime(weatherData.sys.sunrise * 1000);
  var sunSet = new Date();
  sunSet.setTime(weatherData.sys.sunset * 1000);
  var currentDateTime = new Date();
  currentDateTime.setTime(weatherData.dt * 1000);
  var lastUpdateTimestamp = weatherData.dt;
  lastUpdateTimestamp = new Date(lastUpdateTimestamp * 1000);
  lastUpdateTimestamp = lastUpdateTimestamp.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric'});


  var options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
  var formattedDateTime = currentDateTime.toLocaleString('en-US', options);
  var iconUrl = weatherData.weather[0].icon;
  iconUrl = 'http://openweathermap.org/img/wn/' + iconUrl + '@2x.png';
  var weatherIconElement = document.createElement('img');
  weatherIconElement.src = iconUrl;
  weatherIconElement.alt = 'Weather Icon';
  var weatherIconContainer = document.getElementById('weatherIcon');
  weatherIconContainer.innerHTML = '';
  weatherIconContainer.appendChild(weatherIconElement);

  var currentUnit = unitBtn.getAttribute('data-units');
  if (currentUnit === 'F') {
    temperature = (currentTemp * 9 / 5) + 32;
  }
  var windDirectionDegrees = weatherData.wind.deg;
  console.log(windDirectionDegrees);
  var windDirectionText = getWindDirectionText(windDirectionDegrees);

  document.getElementById('currentDateTime').textContent = formattedDateTime;
  document.getElementById('cityName').textContent = cityName;
  document.getElementById('temperature').textContent = temperature + "°" + currentUnit;
  document.getElementById('temp_feelsLike').textContent = feelsLike + "°" + currentUnit;
  document.getElementById('temp_min').textContent = minTemp + "°" + currentUnit;
  document.getElementById('temp_max').textContent = maxTemp + "°" + currentUnit;
  document.getElementById('weatherDescription').textContent = weatherDescription;
  document.getElementById('windSpeed').textContent = windSpeed + ' m/s';
  document.getElementById('pressure').textContent = pressure + ' hPa';
  document.getElementById('humidity').textContent = humidity + '%';
  document.getElementById('sunTime').textContent = sunRise.toLocaleTimeString().slice(0, 5) + " - " + sunSet.toLocaleTimeString().slice(0, 5);
  document.getElementById('windDirection').textContent = windDirectionText;
  document.getElementById('lastUpdated').textContent = 'Last updated today at ' + lastUpdateTimestamp;
}

if (window.location.pathname.split("/").pop() === "index.html") {
  const unitBtn = document.getElementById('unitBtn');

  unitBtn.addEventListener('click', function () {
    var currentUnit = document.getElementById('unitBtn').getAttribute('data-units');
    var currentTemp = parseFloat(document.getElementById('temperature').textContent);
    var currentTempMin = parseFloat(document.getElementById('temp_min').textContent);
    var currentTempMax = parseFloat(document.getElementById('temp_max').textContent);
    var currentTempFeelsLike = parseFloat(document.getElementById('temp_feelsLike').textContent);

    if (currentUnit === 'C') {
      currentTemp = (currentTemp * 9 / 5) + 32;
      currentTempMin = (currentTempMin * 9 / 5) + 32;
      currentTempMax = (currentTempMax * 9 / 5) + 32;
      currentTempFeelsLike = (currentTempFeelsLike * 9 / 5) + 32;
      unitBtn.setAttribute('data-units', 'F');
      unitBtn.textContent = '°F';
    } else {
      currentTemp = (currentTemp - 32) * 5 / 9;
      currentTempMin = (currentTempMin - 32) * 5 / 9;
      currentTempMax = (currentTempMax - 32) * 5 / 9;
      currentTempFeelsLike = (currentTempFeelsLike - 32) * 5 / 9;
      unitBtn.setAttribute('data-units', 'C');
      unitBtn.textContent = '°C';
    }

    document.getElementById('temperature').textContent = currentTemp.toFixed(0) + '°' + unitBtn.getAttribute('data-units');
    document.getElementById('temp_min').textContent = currentTempMin.toFixed(0) + '°' + unitBtn.getAttribute('data-units');
    document.getElementById('temp_max').textContent = currentTempMax.toFixed(0) + '°' + unitBtn.getAttribute('data-units');
    document.getElementById('temp_feelsLike').textContent = currentTempFeelsLike.toFixed(0) + '°' + unitBtn.getAttribute('data-units');
  });


  const locateBtn = document.getElementById('locateBtn');
  locateBtn.addEventListener('click', function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        var url = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=ee07e2bf337034f905cde0bdedae3db8';
        var xhr = new XMLHttpRequest();

        xhr.addEventListener('load', function () {
          if (xhr.status >= 200 && xhr.status < 300) {
            var response = JSON.parse(xhr.responseText);
            document.getElementById('cityInput').value = response.name;
            handleFormSubmission();

          } else {
            console.error('The request failed with status code ' + xhr.status);
          }
        });

        xhr.addEventListener('error', function () {
          console.error('A network error occurred');
        });

        xhr.addEventListener('timeout', function () {
          console.error('The request timed out');
        });

        xhr.open('GET', url, true);
        xhr.send();
      });
    } else {
      alert('Geolocation is not supported by your browser');
    }
  });

  var areCardsVisible = false;
  document.getElementById('moreBtn').addEventListener('click', function () {
    var cards = document.getElementsByClassName('card');
    var img = this.querySelector('img');

    if (areCardsVisible) {
      for (var i = 0; i < cards.length; i++) {
        cards[i].style.opacity = '0';
        cards[i].style.visibility = 'hidden';
      }
      window.scrollTo({top: 0, behavior: 'smooth'});

      img.style.transform = 'rotate(0deg)';
      areCardsVisible = false;
    } else {
      for (var i = 0; i < cards.length; i++) {
        cards[i].style.opacity = '1';
        cards[i].style.visibility = 'visible';
      }
      window.scrollTo({top: 650, behavior: 'smooth'});
      img.style.transform = 'rotate(180deg)';
      areCardsVisible = true;
    }
  });
}

function getWindDirectionText(degrees) {
  if (degrees >= 348.75 || degrees < 11.25) {
    return 'North';
  } else if (degrees >= 11.25 && degrees < 78.75) {
    return 'North East';
  } else if (degrees >= 78.75 && degrees < 101.25) {
    return 'East';
  } else if (degrees >= 101.25 && degrees < 168.75) {
    return 'South East';
  } else if (degrees >= 168.75 && degrees < 191.25) {
    return 'South';
  } else if (degrees >= 191.25 && degrees < 258.75) {
    return 'South West';
  } else if (degrees >= 258.75 && degrees < 281.25) {
    return 'West';
  } else if (degrees >= 281.25 && degrees < 348.75) {
    return 'North West';
  } else {
    return '';
  }
}

const menuButton = document.getElementById('menuButton');
const navLinks = document.getElementById('navLinks');
menuButton.addEventListener('click', () => {
  if (navLinks.style.display === 'flex') {
    navLinks.style.animation = 'slideOutToRight 0.5s forwards';
    setTimeout(() => {
      navLinks.style.display = 'none';
    }, 500);
  } else {
    navLinks.style.display = 'flex';
    navLinks.style.animation = 'slideInFromRight 0.5s forwards';
  }
});

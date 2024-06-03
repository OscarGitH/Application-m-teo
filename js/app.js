const apiKey = 'ee07e2bf337034f905cde0bdedae3db8';
jQuery(document).ready(function () {
        const path = window.location.pathname;
        const page = path.split("/").pop();
        if (page !== "index.html") {
            $('#cityInput').prop('disabled', true);
            $('#submitButton').prop('disabled', true);
        } else {
            $('#submitButton').click(function () {
                getCoordinatesFromCity($('#cityInput').val());
            });

            let cityInput = $('#cityInput');
            cityInput.val("Paris");
            getCoordinatesFromCity(cityInput.val());
        }
        ;

        function getCoordinatesFromCity(cityName) {
            const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${apiKey}`;

            $.get(url, function (data) {
                if (data.length > 0) {
                    const lat = data[0].lat;
                    const lon = data[0].lon;

                    getAPIWeather(lat, lon);
                    getAPIForecast(lat, lon);
                } else {
                    console.error(`No coordinates found for city: ${cityName}`);
                }
            }).fail(function (jqXHR, textStatus) {
                console.error('The request failed with status code ' + textStatus);
            });
        }

        function getAPIWeather(lat, lon) {
            const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            $.get(weatherUrl, function (data) {
                displayWeatherData(data, $('#cityInput').val());

                getAPIForecast(lat, lon);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.error('Error fetching weather data:', textStatus, errorThrown);
            });
        }

        function getAPIForecast(lat, lon) {
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            $.get(forecastUrl, function (data) {
                displayForecast(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.error('Error fetching forecast:', textStatus, errorThrown);
            });
        }

        function displayForecast(forecastData) {
            if (!forecastData.list || !Array.isArray(forecastData.list)) {
                console.error('Invalid forecast data:', forecastData);
                return;
            }

            const forecastList = forecastData.list;
            const forecastContainer = $('#forecastContainer');
            forecastContainer.empty();

            const forecastsByDay = forecastList.reduce((groups, forecast) => {
                const date = new Date(forecast.dt * 1000).toISOString().split('T')[0];
                if (!groups[date]) {
                    groups[date] = [];
                }
                groups[date].push(forecast);
                return groups;
            }, {});

            for (const date in forecastsByDay) {
                const forecast = forecastsByDay[date][0];
                const dayOfWeek = new Date(date).toLocaleDateString('en-US', {weekday: 'long'}).slice(0, 3) + '.';
                const temp = forecast.main.temp;
                const description = forecast.weather[0].description;
                const icon = forecast.weather[0].icon;

                const minTemp = Math.min(...forecastsByDay[date].map(forecast => forecast.main.temp_min));
                const maxTemp = Math.max(...forecastsByDay[date].map(forecast => forecast.main.temp_max));

                const forecastElement = `
            <div class="grid-item-forecast">
                <h2>${dayOfWeek}</h2>
                <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
                <div>
                    <i class="wi wi-thermometer"></i>
                    <p class="tempUnit">${temp}°C</p>
                </div>
                <p>${description}</p>
                <div>
                    <i class="wi wi-direction-down"></i>
                    <p class="tempUnit">${minTemp}°C</p>
                </div>
                <div>
                    <i class="wi wi-direction-up"></i>
                    <p class="tempUnit">${maxTemp}°C</p>
                </div>
            </div>
        `;

                forecastContainer.append(forecastElement);
            }
        }

        function selectRelevantInfo(forecastsForDay) {
            const minTemp = Math.min(...forecastsForDay.map(forecast => forecast.main.temp_min));
            const maxTemp = Math.max(...forecastsForDay.map(forecast => forecast.main.temp_max));
            const icon = forecastsForDay[0].weather[0].icon;

            return {
                minTemp: minTemp, maxTemp: maxTemp, icon: icon
            };
        }

        function addInfoToGridItem(day, info) {
            const gridItem = $('.day' + day);
            const tempMinElement = $('.tempMin' + day);
            const tempMaxElement = $('.tempMax' + day);
            const iconElement = $('.icon' + day);

            tempMinElement.textContent = info.minTemp;
            tempMaxElement.textContent = info.maxTemp;
            iconElement.src = "http://openweathermap.org/img/wn/" + info.icon + ".png";
        }

        function displayWeatherData(weatherData, cityInput) {
            const cityName = cityInput;
            let temperature = Math.round(weatherData.main.temp);
            const feelsLike = Math.round(weatherData.main.feels_like);
            const minTemp = Math.round(weatherData.main.temp_min);
            const maxTemp = Math.round(weatherData.main.temp_max);
            const weatherDescription = weatherData.weather[0].description;
            const windSpeed = Math.round(weatherData.wind.speed * 3.6);
            const pressure = weatherData.main.pressure;
            const humidity = weatherData.main.humidity;
            const sunRise = new Date();
            sunRise.setTime(weatherData.sys.sunrise * 1000);
            const sunSet = new Date();
            sunSet.setTime(weatherData.sys.sunset * 1000);
            const currentDateTime = new Date();
            currentDateTime.setTime(weatherData.dt * 1000);
            let lastUpdateTimestamp = weatherData.dt;
            lastUpdateTimestamp = new Date(lastUpdateTimestamp * 1000);
            lastUpdateTimestamp = lastUpdateTimestamp.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric'});


            const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
            const formattedDateTime = currentDateTime.toLocaleString('en-US', options);
            let iconUrl = weatherData.weather[0].icon;
            iconUrl = 'http://openweathermap.org/img/wn/' + iconUrl + '@2x.png';
            const weatherIconElement = document.createElement('img');
            weatherIconElement.src = iconUrl;
            weatherIconElement.alt = 'Weather Icon';
            const weatherIconContainer = document.getElementById('weatherIcon');
            weatherIconContainer.innerHTML = '';
            weatherIconContainer.appendChild(weatherIconElement);

            const currentUnit = unitBtn.getAttribute('data-units');
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
            $(document).ready(function () {
                $('#unitBtn').on('click', function () {
                    const unitBtn = $(this);
                    const currentUnit = unitBtn.attr('data-units');
                    const newUnit = currentUnit === 'C' ? 'F' : 'C';
                    const conversionFactor = currentUnit === 'C' ? (9 / 5) : (5 / 9);
                    const conversionOffset = currentUnit === 'C' ? 32 : -32;
                    const newUnitSymbol = currentUnit === 'C' ? '°F' : '°C';

                    unitBtn.attr('data-units', newUnit);
                    unitBtn.text(newUnitSymbol);

                    $('.tempUnit').each(function () {
                        const $this = $(this);
                        let temp = parseFloat($this.text().replace('°', ''));

                        if (currentUnit === 'C') {
                            temp = (temp * conversionFactor) + conversionOffset;
                        } else {
                            temp = (temp + conversionOffset) * conversionFactor;
                        }

                        $this.text(temp.toFixed(0) + newUnitSymbol);
                    });
                });
            });


            let areCardsVisible = false;
            document.getElementById('moreBtn').addEventListener('click', function () {
                let i;
                const cards = document.getElementsByClassName('card');
                const img = this.querySelector('img');
                const gridContainer = document.querySelector('.grid-container');
                let cardForecast = document.querySelector('.cardForecast');

                if (areCardsVisible) {
                    for (i = 0; i < cards.length; i++) {
                        cards[i].style.opacity = '0';
                        cards[i].style.visibility = 'hidden';
                        cards[i].style.display = 'none';
                    }
                    window.scrollTo({top: 0, behavior: 'smooth'});

                    img.style.transform = 'rotate(0deg)';
                    setTimeout(function () {
                        gridContainer.style.display = 'none';

                    }, 600);
                    areCardsVisible = false;
                } else {
                    for (i = 0; i < cards.length; i++) {
                        cards[i].style.opacity = '1';
                        cards[i].style.visibility = 'visible';
                        cards[i].style.display = 'block';
                    }
                    window.scrollTo({top: 650, behavior: 'smooth'});
                    img.style.transform = 'rotate(180deg)';
                    gridContainer.style.display = 'flex';
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

        $('#menuButton').on('click', function () {
            const navLinks = $('#navLinks');
            if (navLinks.css('display') === 'flex') {
                navLinks.css('animation', 'slideOutToRight 0.5s forwards');
                setTimeout(() => {
                    navLinks.css('display', 'none');
                }, 500);
            } else {
                navLinks.css('display', 'flex');
                navLinks.css('animation', 'slideInFromRight 0.5s forwards');
            }
        });

        $('#locateBtn').on('click', function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        const lat = position.coords.latitude;
                        const lon = position.coords.longitude;
                        const url = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=ee07e2bf337034f905cde0bdedae3db8';
                        $.get(url)
                            .done(function (data) {
                                $('#cityInput').val(data.name);
                                getAPIWeather(lat, lon);
                            })
                            .fail(function (jqXHR, textStatus, errorThrown) {
                                console.error('The request failed:', textStatus, errorThrown);
                            });
                    },
                    function (error) {
                        console.error('Geolocation error:', error);
                    }
                );
            } else {
                console.error('Geolocation is not supported by your browser');
            }
        });
    }
);
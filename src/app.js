// date and time

let now = new Date();
function formatDate(date) {
  let dates = date.getDate();
  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minute = date.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }

  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[date.getDay()];
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[date.getMonth()];

  let dateElement = document.querySelector("#date");
  dateElement.innerHTML = `<small><em>Last updated:
  ${day} ${dates} ${month},  ${hour}:${minute}</em></small>`;
}
console.log(formatDate(now));

// forecast time

function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minute = date.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }

  return `${hour}:${minute}`;
}

// forecast day

function formatDay(timestamp) {
  let dayForecast = new Date(timestamp);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  let day = days[dayForecast.getDay()];

  return `${day}`;
}

// temperature data

function showTemperature(response) {
  celsiusTemperature = response.data.main.temp;
  let temperatureElement = document.querySelector("#mainTemp");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  let city = response.data.name;
  let cityName = document.querySelector("#city-name");
  cityName.innerHTML = city;
  let description = response.data.weather[0].description;
  let descriptionElement = document.querySelector("#description");
  descriptionElement.innerHTML = description;
  let wind = Math.round(response.data.wind.speed);
  let windSpeed = document.querySelector("#wind");
  windSpeed.innerHTML = `Wind: ${wind} km/h`;
  let humidity = Math.round(response.data.main.humidity);
  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = `Humidity: ${humidity}%`;
  let minimum = Math.round(response.data.main.temp_min);
  let minimumElement = document.querySelector("#min");
  minimumElement.innerHTML = `${minimum}°`;
  let maximum = Math.round(response.data.main.temp_max);
  let maximumElement = document.querySelector("#max");
  maximumElement.innerHTML = `${maximum}°`;
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
}

// forecast by time and day

function displayHourlyForecast(response) {
  let hourlyForecast = document.querySelector("#forecast-one");
  hourlyForecast.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];
    hourlyForecast.innerHTML += ` <div class="col-2">
                <small>${formatHours(forecast.dt * 1000)}</small>
                <img src="https://openweathermap.org/img/wn/${
                  forecast.weather[0].icon
                }@2x.png"/>
                <div class="forecast-time">${Math.round(
                  forecast.main.temp
                )}°</div>
              </div>`;
  }

  let dayForecast = document.querySelector("#forecast-two");
  dayForecast.innerHTML = null;
  let forecastByDay = null;

  for (let index = 2; index < 35; index += 8) {
    forecastByDay = response.data.list[index];
    dayForecast.innerHTML += `<div class="col-4"><div class="day">${formatDay(
      forecastByDay.dt * 1000
    )}</div></div>
              <div class="col-4">
                <img src="https://openweathermap.org/img/wn/${
                  forecastByDay.weather[0].icon
                }@2x.png"/>
              </div>
              <div class="col-4">
                <div class="day-temp">
                  <strong> <span id="day-max">${Math.round(
                    forecastByDay.main.temp_max
                  )}°</span> </strong> |
                  <span id="day-min">${Math.round(
                    forecastByDay.main.temp_min
                  )}°</span>
                </div>
              </div>`;
  }
}

// search data

function search(city) {
  let apiKey = "0864ac7dec2540b572d96a9d7503af67";
  let unit = "metric";

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(showTemperature);

  let apiUrlFor = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrlFor).then(displayHourlyForecast);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#enter-city").value;
  search(city);
}

// current location data

function locationButton(position) {
  let apiKey = "0864ac7dec2540b572d96a9d7503af67";
  let lat = `${position.coords.latitude}`;
  let lon = `${position.coords.longitude}`;
  let unit = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(showTemperature);

  let apiUrlForcast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrlForcast).then(displayHourlyForecast);
}

function showLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(locationButton);
}

// temperature units

function displayFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#mainTemp");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelsius(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#mainTemp");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

// global units outside of functions

let form = document.querySelector("#search");
form.addEventListener("submit", handleSubmit);

let locationElement = document.querySelector("#location");
locationElement.addEventListener("click", showLocation);

let celsiusTemperature = null;

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsius);

search("London");

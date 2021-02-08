// date and time

let now = new Date();
let dates = now.getDate();
let hour = now.getHours();
if (hour < 10) {
  hour = `0${hour}`;
}
let minute = now.getMinutes();
if (minute < 10) {
  minute = `0${minute}`;
}

let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let day = days[now.getDay()];
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
let month = months[now.getMonth()];

let dateElement = document.querySelector("#date");
dateElement.innerHTML = `<small>
  ${day} ${dates} ${month},  ${hour}:${minute}</small>`;

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
  celsiusTemperature = response.data.current.temp;
  let temperatureElement = document.querySelector("#mainTemp");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  let description = response.data.current.weather[0].description;
  let descriptionElement = document.querySelector("#description");
  descriptionElement.innerHTML = description;
  let wind = Math.round(response.data.current.wind_speed);
  let windSpeed = document.querySelector("#wind");
  windSpeed.innerHTML = `Wind: ${wind} km/h`;
  let humidity = Math.round(response.data.current.humidity);
  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = `Humidity: ${humidity}%`;
  let minimum = Math.round(response.data.daily[0].temp.min);
  let minimumElement = document.querySelector("#min");
  minimumElement.innerHTML = `${minimum}°`;
  let maximum = Math.round(response.data.daily[0].temp.max);
  let maximumElement = document.querySelector("#max");
  maximumElement.innerHTML = `${maximum}°`;
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.current.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.current.weather[0].description);

  let timestamp = response.data.current.dt;
  let timezoneOffset = response.data.timezone_offset;
  let localTimestamp = timestamp + timezoneOffset;
  let time = formatHours(localTimestamp * 1000);

  dateElement.innerHTML = `<small>
  ${day} ${dates} ${month},  ${time}</small>`;
}

// forecast by time and day

function displayForecast(response) {
  let hourlyForecast = document.querySelector("#forecast-one");
  hourlyForecast.innerHTML = null;
  let forecastByHour = null;

  for (let index = 0; index < 6; index++) {
    forecastByHour = response.data.hourly[index];
    let localTimestamp = forecastByHour.dt + response.data.timezone_offset;

    hourlyForecast.innerHTML += ` <div class="col-2">
                <small>${formatHours(localTimestamp * 1000)}</small>
                <img src="https://openweathermap.org/img/wn/${
                  forecastByHour.weather[0].icon
                }@2x.png"/>
                <div class="forecast-time">${Math.round(
                  forecastByHour.temp
                )}°</div>
              </div>`;
  }

  let dailyForecast = document.querySelector("#forecast-two");
  dailyForecast.innerHTML = null;
  let forecastByDay = null;

  for (let index = 1; index < 6; index++) {
    forecastByDay = response.data.daily[index];
    let localTimestamp = forecastByDay.dt + response.data.timezone_offset;

    dailyForecast.innerHTML += `<div class="col-4"><div class="day">${formatDay(
      localTimestamp * 1000
    )}</div></div>
              <div class="col-4">
                <img src="https://openweathermap.org/img/wn/${
                  forecastByDay.weather[0].icon
                }@2x.png"/>
              </div>
              <div class="col-4">
                <div class="day-temp">
                  <strong> <span id="day-max">${Math.round(
                    forecastByDay.temp.max
                  )}°</span> </strong> |
                  <span id="day-min">${Math.round(
                    forecastByDay.temp.min
                  )}°</span>
                </div>
              </div>`;
  }
}

// City coords in real time

function getCityCoords(response) {
  document.querySelector(
    "#city-name"
  ).innerHTML = `${response.data.name}, ${response.data.sys.country}`;

  let cityLatitude = response.data.coord.lat;
  let cityLongitude = response.data.coord.lon;
  let unit = "metric";

  let currentapiKey = "0864ac7dec2540b572d96a9d7503af67";
  let currentapiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLatitude}&lon=${cityLongitude}&exclude=minutely&units=${unit}&appid=${currentapiKey}`;
  axios.get(currentapiUrl).then(showTemperature);
  axios.get(currentapiUrl).then(displayForecast);
}

// search data

function search(city) {
  let apiKey = "0864ac7dec2540b572d96a9d7503af67";
  let unit = "metric";

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(getCityCoords);
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
  axios.get(apiUrl).then(getCityCoords);
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

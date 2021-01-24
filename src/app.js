function showTemperature(response) {
  console.log(response.data);
  let temperature = Math.round(response.data.main.temp);
  let temperatureElement = document.querySelector("#mainTemp");
  temperatureElement.innerHTML = temperature;
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
}

let apiKey = "0864ac7dec2540b572d96a9d7503af67";
let unit = "metric";
let city = "London";
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
axios.get(apiUrl).then(showTemperature);

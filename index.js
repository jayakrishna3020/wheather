const API_KEY = "f13b43b6a9d6fc8d9ea82a7e352da632";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const loading = document.getElementById("loading");
const errorDiv = document.getElementById("error");

const weatherCard = document.getElementById("weatherCard");

const cityName = document.getElementById("cityName");
const temp = document.getElementById("temp");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");

const forecastContainer =
document.getElementById("forecastContainer");

window.addEventListener("load", () => {
    const savedCity = localStorage.getItem("city");

    if(savedCity){
        getWeather(savedCity);
    }
});

searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if(city){
        localStorage.setItem("city", city);
        getWeather(city);
    }
});

async function getWeather(city){

    try{

        loading.classList.remove("hidden");
        errorDiv.textContent = "";

        const currentWeatherURL =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

        const forecastURL =
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

        const weatherResponse =
        await fetch(currentWeatherURL);

        if(!weatherResponse.ok){
            throw new Error("City not found");
        }

        const weatherData =
        await weatherResponse.json();

        const forecastResponse =
        await fetch(forecastURL);

        const forecastData =
        await forecastResponse.json();

        displayCurrentWeather(weatherData);
        displayForecast(forecastData);

    }
    catch(error){
        errorDiv.textContent = error.message;
    }
    finally{
        loading.classList.add("hidden");
    }
}

function displayCurrentWeather(data){

    weatherCard.classList.remove("hidden");

    cityName.textContent =
    `${data.name}, ${data.sys.country}`;

    temp.textContent =
    `Temperature: ${data.main.temp}°C`;

    description.textContent =
    `Weather: ${data.weather[0].description}`;

    humidity.textContent =
    `Humidity: ${data.main.humidity}%`;

    wind.textContent =
    `Wind Speed: ${data.wind.speed} m/s`;
}

function displayForecast(data){

    forecastContainer.innerHTML = "";

    const dailyForecasts = data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    dailyForecasts.forEach(day => {

        const card =
        document.createElement("div");

        card.classList.add("forecast-card");

        const date =
        new Date(day.dt_txt);

        card.innerHTML = `
            <h3>${date.toLocaleDateString()}</h3>
            <p>${day.main.temp}°C</p>
            <p>${day.weather[0].description}</p>
        `;

        forecastContainer.appendChild(card);
    });
}
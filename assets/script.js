const apiKey = 'd68a2ac9d30df41f9d6ca649fb111b00';

document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.getElementById('search-button');
  const searchInput = document.getElementById('city-search');
  const forecastContainer = document.getElementById('forecast-container');
  const todaysWeather = document.querySelector(".todays-weather")
  const historySection = document.getElementById('city-list');

  searchButton.addEventListener('click', () => {
    saveForecast()
    const city = searchInput.value.trim();
    if (city !== '') {
      getWeatherData(city);
      searchInput.value = '';
    }
  });

  const saveForecast = () => {
    const cityToSave = searchInput.value.trim();
    const savedCitys = JSON.parse(localStorage.getItem('savedCitys')) || [];
    savedCitys.push(cityToSave)
    localStorage.setItem("savedCitys" , JSON.stringify(savedCitys))

    makeButtons(cityToSave)
  }

  const makeButtons = (savedCitys) => {
    const historyCitys = document.createElement('li')
    historyCitys.classList.add('city-option')
    historyCitys.textContent = savedCitys;
    historySection.appendChild(historyCitys);
    
    historyCitys.addEventListener('click', function(e){
      e.preventDefault()
      let pastcitys = historyCitys.textContent
      getWeatherData(pastcitys)
    })   
  }

  const cityButtons = document.querySelectorAll('.city-option');

  cityButtons.forEach(button => {
    button.addEventListener('click', () => {
      const city = button.textContent;
      getWeatherData(city);
    });
  });

  function displayForecast(forecastArray, daydata) {
    console.log(daydata)
    forecastContainer.innerHTML = '';
    todaysWeather.innerHTML = '';

    

    const currentDate = new Date();
    const currentDayContainer = createForecastItemContainer('Today', forecastArray[0]);
    const nameofCity = document.createElement('h1')
     nameofCity.textContent = daydata;
     currentDayContainer.appendChild(nameofCity);
    todaysWeather.appendChild(currentDayContainer);

    for (let i = 1; i < forecastArray.length; i++) {
      const forecast = forecastArray[i];
      const forecastDate = new Date(currentDate.getTime() + i * 24 * 60 * 60 * 1000);
      const forecastItemContainer = createForecastItemContainer(forecastDate.toLocaleDateString('en-US', { weekday: 'long' }), forecast);
      forecastContainer.appendChild(forecastItemContainer);
    }
  }

  function createForecastItemContainer(day, forecast) {
    const forecastItemContainer = document.createElement('div');
    forecastItemContainer.classList.add('forecast-item');

    const forecastImage = document.createElement('img')
    const forecastIcon = forecast.weather[0].icon
    const imageSrc = `http://api.openweathermap.org/img/w/${forecastIcon}.png`
    forecastImage.setAttribute('src', imageSrc)

    const forecastDay = document.createElement('h2');
    forecastDay.textContent = day;

    const forecastDescription = document.createElement('p');
    forecastDescription.textContent = forecast.weather[0].description;

    const forecastTemperature = document.createElement('p');
    forecastTemperature.textContent = `Temperature: ${forecast.main.temp} f`;

    const forecastHumidity = document.createElement('p');
    forecastHumidity.textContent = `Humidity: ${forecast.main.humidity}%`;

    const forecastWindSpeed = document.createElement('p');
    forecastWindSpeed.textContent = `Wind Speed: ${forecast.wind.speed} m/s`;

    forecastItemContainer.appendChild(forecastDay);
    forecastItemContainer.appendChild(forecastDescription);
    forecastItemContainer.appendChild(forecastTemperature);
    forecastItemContainer.appendChild(forecastHumidity);
    forecastItemContainer.appendChild(forecastWindSpeed);
    forecastItemContainer.appendChild(forecastImage)

    return forecastItemContainer;
  }

  function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        const daydata = data.city.name;
     
        
        const forecastData = data.list.slice(1, 7);
        displayForecast(forecastData, daydata);
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }
});

lucide.createIcons();
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');
const weatherInfo = document.getElementById('weather-info');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const condition = document.getElementById('condition');
const API_KEY = 'bd5e378503939ddaee76f12ad7a97608';

function setLoading(isLoading) {
  loadingElement.classList.toggle('hidden', !isLoading);
  weatherInfo.classList.toggle('hidden', isLoading);
  errorElement.classList.add('hidden');
}
function showError(message) {
  errorElement.textContent = message;
  errorElement.classList.remove('hidden');
  weatherInfo.classList.add('hidden');
}
function updateWeatherInfo(data) {
  cityName.textContent = data.name;
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  description.textContent = data.weather[0].description;
  feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
  humidity.textContent = `${data.main.humidity}%`;
  windSpeed.textContent = `${data.wind.speed} m/s`;
  condition.textContent = data.weather[0].main;
  
  weatherInfo.classList.remove('hidden');
}

async function fetchWeatherByCity(city) {
  try {
    setLoading(true);
    
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error('City not found');
    }
    
    const data = await response.json();
    updateWeatherInfo(data);
  } catch (err) {
    showError(err.message);
  } finally {
    setLoading(false);
  }
}

async function fetchWeatherByCoords(lat, lon) {
  try {
    setLoading(true);
    
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error('Unable to fetch weather data');
    }
    
    const data = await response.json();
    updateWeatherInfo(data);
    
    cityInput.value = data.name;
  } catch (err) {
    showError(err.message);
  } finally {
    setLoading(false);
  }
}


function getUserLocation() {
  if ('geolocation' in Navigator) {
    setLoading(true);
    Navigator.geolocation.getCurrentPosition(
      
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      
      (error) => {
        console.error('Geolocation error:', error);
        showError('Unable to get your location. Please search for a city manually.');
        
        fetchWeatherByCity('London');
      },
  
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  } else {
    showError('Geolocation is not supported by your browser. Please search for a city manually.');

    fetchWeatherByCity('London');
  }
}


searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    fetchWeatherByCity(city);
  }
});

getUserLocation();
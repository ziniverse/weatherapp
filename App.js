import React, { useState } from 'react';
import './App.css';

const API_KEY = 'e2c8fc6b7ea96c93bb2dda97af03a060';

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [isDay, setIsDay] = useState(true); // New state for day or night

  const search = async evt => {
    if (evt.key === 'Enter') {
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&APPID=${API_KEY}`);
        const data = await response.json();
        if (data) {
          setWeather(data);
          determineDayNight(data); // Determine if it's day or night based on the data
        }
      } catch (error) {
        console.error(error); // Make sure to handle errors
      }
      setQuery('');
    }
  };

  // Function to determine if it's day or night
  const determineDayNight = (data) => {
    const now = new Date().getTime();
    const sunrise = new Date(data.sys.sunrise * 1000);
    const sunset = new Date(data.sys.sunset * 1000);

    setIsDay(now >= sunrise && now < sunset);
  };
  const getWeatherAnimationClass = () => {
    if (!weather.weather) return '';
  
    let weatherCondition = weather.weather[0].main.toLowerCase(); // e.g., 'snow'
    let timeOfDay = isDay ? 'day' : 'night'; // Determine if it's day or night
  
    // Normalize the weather condition for class naming
    switch(weatherCondition) {
      case 'clear':
      case 'clouds': weatherCondition = 'clear'; break;
      case 'rain': weatherCondition = 'rainy'; break;
      case 'snow': weatherCondition = 'snowy'; break;
      // Add more cases as necessary
      default: weatherCondition = 'default'; break; // A fallback style
    }
  
    // Return the class string
    return `${weatherCondition}.${timeOfDay}`;  // e.g., 'snowy.night'
  };
  
  

  return (
    <div className={`app ${getWeatherAnimationClass()}`}>
      {weather.main ? (
        <div className="city-box">
          <div className="search-box">
            <input 
              type="text"
              className="search-bar"
              placeholder="Search..."
              onChange={e => setQuery(e.target.value)}
              value={query}
              onKeyPress={search}
            />
          </div>
          <div className="city">{weather.name}, {weather.sys.country}</div>
          <div className="weather">
            <img 
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} 
              alt={weather.weather[0].main} 
            />
            <p>{weather.weather[0].main}</p>
          </div>
          <div className="time">{/* Modified to show actual local time */}
            {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true})}
          </div>
          <div className="temperature">{Math.round(weather.main.temp)}°c</div>
          <div className="details">
            <div>Humidity: {weather.main.humidity}%</div>
            <div>Wind Speed: {weather.wind.speed} km/h</div>
          </div>
        </div>
      ) : (
        <div className="city-box">
          <div className="search-box">
            <input 
              type="text"
              className="search-bar"
              placeholder="Search..."
              onChange={e => setQuery(e.target.value)}
              value={query}
              onKeyPress={search}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
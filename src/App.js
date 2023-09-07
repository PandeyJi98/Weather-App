import React, { useState } from 'react';
import './App.css'; // Import your CSS file

function WeatherApp() {
  const [inputValue, setInputValue] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isCelsius, setIsCelsius] = useState(true); // Default to Celsius
  const apiKey = '4d8fb5b93d4af21d66a2948710284366';

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeatherData();
  };

  const fetchWeatherData = () => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${apiKey}&units=${isCelsius ? 'metric' : 'imperial'}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.cod === '404') {
          setErrorMsg('City not found. Please enter a valid city name.');
          setWeatherData(null);
        } else {
          setErrorMsg('');
          setWeatherData(data);
        }
      })
      .catch(() => {
        setErrorMsg('An error occurred. Please try again later.');
        setWeatherData(null);
      });
  };

  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };

  // Placeholder for rendering city cards
  const renderCityCards = () => {
    if (!weatherData) {
      return null;
    }

    return (
      <li className="city">
        <h2 className="city-name">
          {weatherData.name}, {weatherData.sys.country}
        </h2>
        <div className="city-temp">
          {Math.round(weatherData.main.temp)}<sup>{isCelsius ? '°C' : '°F'}</sup>
        </div>
        <figure>
          <img
            className="city-icon"
            src={`https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weatherData.weather[0].icon}.svg`}
            alt={weatherData.weather[0].description}
          />
          <figcaption>{weatherData.weather[0].description}</figcaption>
        </figure>
      </li>
    );
  };

  return (
    <div>
      <div className="parent">
        <div className="top-banner">
          <h1 className="heading"> Weather App</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Search for a city"
              value={inputValue}
              onChange={handleInputChange}
              autoFocus
            />
            <button type="submit">SUBMIT</button>
          </form>
          {errorMsg && <div className="msg error-message">{errorMsg}</div>}
        </div>
        
        { weatherData && (
          <div className="card-section">
            <button className="unit-toggle-button" onClick={toggleTemperatureUnit}>
              Convert in {isCelsius ? 'Fahrenheit' : 'Celsius'}
            </button>
            <ul className="cities">
              {renderCityCards()} {/* Render city cards here */}
            </ul>
          </div>
        )}
       
      </div>
    </div>
  );
}

export default WeatherApp;

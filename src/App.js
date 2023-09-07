import React, { useState, useEffect } from 'react';
import './App.css'; // Import your CSS file

function WeatherApp() {
  const [inputValue, setInputValue] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isCelsius, setIsCelsius] = useState(true); // Default to Celsius
  const apiKey = '4d8fb5b93d4af21d66a2948710284366';
  const [locationFetched, setLocationFetched] = useState(true); // Initialize to true

  useEffect(() => {
    // Fetch weather data for the user's current location only once on component mount
    if (!locationFetched) {
      getCurrentLocationWeather();
      setLocationFetched(true);
    }
  }, [locationFetched]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') {
      setErrorMsg('Please enter a city name.');
    } else {
      setErrorMsg('');
      fetchWeatherData();
    }
  };

  const fetchWeatherData = () => {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${apiKey}&units=${isCelsius ? 'metric' : 'imperial'}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${inputValue}&appid=${apiKey}&units=${isCelsius ? 'metric' : 'imperial'}`;

    Promise.all([fetch(currentWeatherUrl), fetch(forecastUrl)])
      .then(([currentWeatherResponse, forecastResponse]) =>
        Promise.all([currentWeatherResponse.json(), forecastResponse.json()])
      )
      .then(([currentWeatherData, forecastData]) => {
        if (currentWeatherData.cod === '404') {
          setErrorMsg('City not found. Please enter a valid city name.');
          setWeatherData(null);
        } else {
          setErrorMsg('');
          setWeatherData({ current: currentWeatherData, forecast: forecastData });
        }
      })
      .catch(() => {
        setErrorMsg('An error occurred. Please try again later.');
        setWeatherData(null);
      });
  };

  const getCurrentLocationWeather = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const { latitude, longitude } = position.coords;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${isCelsius ? 'metric' : 'imperial'}`;

        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            setErrorMsg('');
            setWeatherData({ current: data, forecast: null });
          })
          .catch(() => {
            setErrorMsg('An error occurred. Please try again later.');
            setWeatherData(null);
          });
      });
    } else {
      setErrorMsg('Geolocation is not available in your browser.');
    }
  };

  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };

  // Placeholder for rendering city cards
  const renderCityCards = () => {
    if (!weatherData) {
      return null;
    }

    const { current, forecast } = weatherData;

    return (
      <div className='container'>
        <li className="city">
          <h2 className="city-name">
            {current.name}, {current.sys.country}
          </h2>
          <div className="city-temp">
            {Math.round(current.main.temp)}<sup>{isCelsius ? '°C' : '°F'}</sup>
          </div>
          <figure>
            <img
              className="city-icon"
              src={`https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${current.weather[0].icon}.svg`}
              alt={current.weather[0].description}
            />
            <figcaption>{current.weather[0].description}</figcaption>
          </figure>
        </li>
        {forecast && (
          <div className="forecast city">
            <h2 className='title'>Next 3 Days Forecast</h2>
            {forecast.list.slice(0, 3).map((item, index) => (
              <div className="forecast-item" key={index}>
                <p className="forecast-date">{item.dt_txt}</p>
                <p className="forecast-temp">
                  {Math.round(item.main.temp)}<sup>{isCelsius ? '°C' : '°F'}</sup>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div >
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
            <button className='' onClick={getCurrentLocationWeather} >Get Weather for Current Location</button>
          </form>
          {errorMsg && <div className="msg error-message">{errorMsg}</div>}
        </div>

        {weatherData && (
          <div className="card-section">
            <button className="unit-toggle-button" onClick={toggleTemperatureUnit}>
              Convert in {isCelsius ? 'Fahrenheit' : 'Celsius'}
            </button>
            <ul className="cities">{renderCityCards()}</ul>
          </div>
        )}

      </div>
    </div>
  );
}

export default WeatherApp

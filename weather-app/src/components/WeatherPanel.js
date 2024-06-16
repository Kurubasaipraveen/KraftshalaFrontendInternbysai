import React, { useState, useEffect } from 'react';
import './index.css';

const WeatherPanel = () => {
  const [theme, setTheme] = useState('light');
  const [locations, setLocations] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [input, setInput] = useState('');

  const apiKey = '424c22e3ccea1bb8cfc19290a9d937fa'; // Replace with your API key

  useEffect(() => {
    const fetchData = async () => {
      const promises = locations.map(async (location) => {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();
        return { location: data.name, data };
      });
      const results = await Promise.all(promises);
      setWeatherData(results);
    };

    fetchData();
  }, [locations, apiKey]);

  useEffect(() => {
    document.body.className = theme; // Apply theme to body
  }, [theme]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();
        if (data.cod === 200) {
          setLocations([...locations, data.name]);
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert('Failed to fetch weather data');
      }
    }
    setInput('');
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`weather-panel ${theme}`}>
      <h1 className='head'>Weather App</h1>
      <button onClick={toggleTheme} className="toggle-button">
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
      <form onSubmit={handleSubmit} className="search">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter city or zip code"
        />
        <button type="submit">Search</button>
      </form>
      {weatherData.map((item, index) => (
        <div className="weather-info" key={index}>
          <h2>{item.location}</h2>
          <div className="weather">
            <p>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
            <h3>Temperature: {Math.round(item.data.main.temp)}°C</h3>
            <p>Description: {item.data.weather[0].description}</p>
            <p>Humidity: {item.data.main.humidity}%</p>
            <p>Wind Speed: {item.data.wind.speed} m/s</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeatherPanel;

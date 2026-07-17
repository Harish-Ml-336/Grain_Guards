import React, { useState, useEffect } from 'react';
import { CloudSun, Cloud, Sun, Droplets, Wind, Eye } from 'lucide-react';
import './WeatherWidget.css';

const API = 'http://localhost:5000/api';

const iconMap = {
  'cloud-sun': CloudSun,
  'cloud': Cloud,
  'sun': Sun,
};

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetch(`${API}/dashboard/weather`)
      .then(r => r.json())
      .then(setWeather)
      .catch(() => {});
  }, []);

  if (!weather) return <div className="weather-widget skeleton-weather"></div>;

  return (
    <div className="weather-widget">
      <div className="weather-sun-icon">☀️</div>
      <div className="weather-header">
        <span className="weather-label">Weather</span>
        <span className="weather-location">{weather.location}</span>
      </div>
      <div className="weather-temp">
        <span className="temp-value">{weather.temperature}°C</span>
        <span className="temp-condition">{weather.condition}</span>
      </div>
      <div className="weather-details">
        <div className="weather-detail">
          <Droplets size={14} />
          <span>Humidity</span>
          <strong>{weather.humidity}%</strong>
        </div>
        <div className="weather-detail">
          <Wind size={14} />
          <span>Wind</span>
          <strong>{weather.wind} km/h</strong>
        </div>
        <div className="weather-detail">
          <Eye size={14} />
          <span>Visibility</span>
          <strong>{weather.visibility} km</strong>
        </div>
      </div>
      <div className="weather-forecast">
        {weather.forecast?.map((f, i) => {
          const FIcon = iconMap[f.icon] || Sun;
          return (
            <div key={i} className="forecast-day">
              <span className="forecast-label">{f.day}</span>
              <FIcon size={18} />
              <span className="forecast-temp">{f.temp}°</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

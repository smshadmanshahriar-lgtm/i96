import { useState, useEffect } from 'react';
import { CloudRain, Sun, Cloud, Wind, CloudLightning, Snowflake } from 'lucide-react';
import './WeatherCard.css';

export default function WeatherCard() {
  const [weatherData, setWeatherData] = useState(null);
  const [locationName, setLocationName] = useState('Locating...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map WMO weather codes to lucide icons and descriptions
  const getWeatherInfo = (code) => {
    if (code <= 3) return { icon: <Sun size={28} color="#FFB020" />, desc: 'Clear' };
    if (code <= 48) return { icon: <Cloud size={28} color="#fff" />, desc: 'Cloudy' };
    if (code <= 69) return { icon: <CloudRain size={28} color="#4D9FFF" />, desc: 'Rain' };
    if (code <= 79) return { icon: <Snowflake size={28} color="#00E5FF" />, desc: 'Snow' };
    if (code <= 99) return { icon: <CloudLightning size={28} color="#FF3366" />, desc: 'Storm' };
    return { icon: <Sun size={28} color="#FFB020" />, desc: 'Clear' };
  };

  const fetchLocationName = async (lat, lon) => {
    try {
      const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
      const data = await res.json();
      const city = data.city || data.locality || 'Unknown City';
      const country = data.countryCode || data.countryName || '';
      setLocationName(`${city}${country ? `, ${country}` : ''}`);
    } catch (e) {
      console.warn("Could not fetch location name", e);
      setLocationName('Current Location');
    }
  };

  const fetchWeather = async (lat, lon) => {
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`);
      if (!res.ok) throw new Error('Weather fetch failed');
      const data = await res.json();
      
      const forecast = [];
      for(let i=1; i<=3; i++) {
        const date = new Date(data.daily.time[i]);
        forecast.push({
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          temp: Math.round(data.daily.temperature_2m_max[i]),
          code: data.daily.weathercode[i]
        });
      }

      setWeatherData({
        temp: Math.round(data.current_weather.temperature),
        code: data.current_weather.weathercode,
        forecast
      });
      
      await fetchLocationName(lat, lon);
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          console.warn("Geolocation denied, defaulting to London.", err);
          fetchWeather(51.5074, -0.1278); // Default to London
        }
      );
    } else {
      fetchWeather(51.5074, -0.1278);
    }
  }, []);

  if (loading) return <div className="i96-card glass-panel weather-card"><div className="weather-content" style={{justifyContent: 'center', alignItems: 'center'}}>Loading Weather...</div></div>;
  if (error) return <div className="i96-card glass-panel weather-card"><div className="weather-content" style={{justifyContent: 'center', alignItems: 'center'}}>Weather Error</div></div>;

  const currentInfo = getWeatherInfo(weatherData.code);

  const getMiniIcon = (code) => {
    if (code <= 3) return <Sun size={16} />;
    if (code <= 48) return <Cloud size={16} />;
    if (code <= 69) return <CloudRain size={16} />;
    if (code <= 79) return <Snowflake size={16} />;
    return <CloudLightning size={16} />;
  };

  return (
    <div className="i96-card glass-panel weather-card">
      <div className="weather-bg-gradient"></div>
      <div className="weather-content">
        <div className="weather-main">
          <div className="weather-temp-box">
            <span className="temp-value">{weatherData.temp}</span>
            <span className="temp-unit">°</span>
          </div>
          <div className="weather-status">
            <div className="weather-icon" style={{marginBottom: '4px'}}>
              {currentInfo.icon}
            </div>
            <span className="weather-desc">{currentInfo.desc}</span>
            <span className="weather-loc" style={{maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block'}} title={locationName}>{locationName}</span>
          </div>
        </div>
        
        <div className="weather-forecast">
          {weatherData.forecast.map((day, idx) => (
            <div key={idx} className="forecast-day">
              <span className="f-day">{day.day}</span>
              <span className="f-icon">{getMiniIcon(day.code)}</span>
              <span className="f-temp">{day.temp}°</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

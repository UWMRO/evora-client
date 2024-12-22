import { useEffect, useState } from 'react';
import { getWeatherData } from '../apiClient';

function Weather() {

    const [temp, setTemp] = useState(0);
    const [humidity, setHumidity] = useState(0);
    const [wind, setWind] = useState(0);

    function updateWeatherData() {
        getWeatherData().then((data) => {
            setTemp(data.tempf);
            setHumidity(data.humidity);
            setWind(data.windspeedmph);
        });
    }

    useEffect(() => {
        updateWeatherData();
        const interval = setInterval(() => {
            updateWeatherData();
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
      <div className="weather-card">
        <div className="weather-info">
          <p>Temperature: <span>{temp}°F</span></p>
          <p>Humidity: <span>{humidity}%</span></p>
          <p>Wind: <span>{wind}mph</span></p>
        </div>
      </div>
    );
}

export default Weather;
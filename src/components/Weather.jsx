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
            <h2>Current Weather</h2>
            <div className="weather-info">
                <p>Temperature: {temp}°F</p>
                <p>Humidity: {humidity}%</p>
                <p>Wind: {wind}mph</p>
            </div>
        </div>
    );
}

export default Weather;
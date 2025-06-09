const axios = require('axios');

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

async function getWeatherAlerts(location) {
  try {
    // First get coordinates from location name
    const geoResponse = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${OPENWEATHER_API_KEY}`
    );

    if (!geoResponse.data || geoResponse.data.length === 0) {
      throw new Error('Location not found');
    }

    const { lat, lon } = geoResponse.data[0];

    // Get current weather
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`
    );

    // Get alerts (if any)
    const alertResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,daily&appid=${OPENWEATHER_API_KEY}`
    );

    const alerts = alertResponse.data.alerts || [];
    const weather = weatherResponse.data;

    // Check for hazardous conditions
    const hazardousConditions = [];
    const weatherMain = weather.weather[0].main.toLowerCase();
    const weatherDesc = weather.weather[0].description.toLowerCase();

    if (['thunderstorm', 'tornado', 'hurricane'].includes(weatherMain)) {
      hazardousConditions.push({
        type: 'extreme',
        title: 'Severe Weather Alert',
        description: `Current weather: ${weatherDesc}. This may damage crops.`,
        severity: 'high',
      });
    }

    if (weatherMain === 'rain' && weather.rain && weather.rain['1h'] > 20) {
      hazardousConditions.push({
        type: 'heavy_rain',
        title: 'Heavy Rainfall Alert',
        description: 'Heavy rain may cause waterlogging and damage to crops.',
        severity: 'medium',
      });
    }

    if (weatherMain === 'snow' && weather.snow && weather.snow['1h'] > 10) {
      hazardousConditions.push({
        type: 'heavy_snow',
        title: 'Heavy Snowfall Alert',
        description: 'Heavy snow may damage crops and affect growth.',
        severity: 'medium',
      });
    }

    if (weather.temp && weather.temp.min < 273) {
      hazardousConditions.push({
        type: 'frost',
        title: 'Frost Alert',
        description: 'Freezing temperatures may damage sensitive crops.',
        severity: 'high',
      });
    }

    return [...alerts, ...hazardousConditions];
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return [];
  }
}

module.exports = { getWeatherAlerts };
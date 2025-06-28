const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { lat, lon } = event.queryStringParameters;
  const weatherApiKey = process.env.WEATHER_API_KEY;

  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weatherApiKey}&lang=pt_br`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${weatherApiKey}&lang=pt_br`;

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl)
    ]);

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        ...currentData,
        forecast: forecastData
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: 'Erro ao buscar clima.'
    };
  }
};

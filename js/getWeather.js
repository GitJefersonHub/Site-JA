
const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { lat, lon } = event.queryStringParameters;
  const weatherApiKey = process.env.WEATHER_API_KEY;

  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weatherApiKey}&lang=pt_br`;

  try {
    const res = await fetch(weatherUrl);
    const data = await res.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: 'Erro ao buscar clima.'
    };
  }
};

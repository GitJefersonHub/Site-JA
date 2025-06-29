const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { lat, lon } = event.queryStringParameters || {};
  const weatherApiKey = process.env.WEATHER_API_KEY;

  if (!lat || !lon) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: true, message: 'Parâmetros de latitude e longitude são obrigatórios.' })
    };
  }

  if (!weatherApiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: true, message: 'Chave da API do clima não configurada.' })
    };
  }

  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weatherApiKey}&lang=pt_br`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${weatherApiKey}&lang=pt_br`;

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl)
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
      const currentText = await currentRes.text();
      const forecastText = await forecastRes.text();
      throw new Error(`Erro nas respostas da API: ${currentText} | ${forecastText}`);
    }

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    if (currentData.cod !== 200 || !currentData.main || !currentData.weather) {
      throw new Error('Dados incompletos recebidos da API (clima atual).');
    }

    if (forecastData.cod !== "200" || !forecastData.list) {
      throw new Error('Dados incompletos recebidos da API (previsão).');
    }

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
      body: JSON.stringify({ error: true, message: `Erro ao buscar clima: ${error.message}` })
    };
  }
};

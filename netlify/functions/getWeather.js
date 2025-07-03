const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { lat, lon } = event.queryStringParameters || {};
  const weatherApiKey = process.env.WEATHER_API_KEY;

  // 🧭 Validação de parâmetros
  if (!lat || !lon) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: true,
        message: 'Parâmetros de latitude e longitude são obrigatórios.'
      })
    };
  }

  // 🔐 Verificação da chave da API
  if (!weatherApiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: true,
        message: 'Chave da API do clima não configurada.'
      })
    };
  }

  const baseParams = `lat=${lat}&lon=${lon}&units=metric&appid=${weatherApiKey}&lang=pt_br`;
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?${baseParams}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?${baseParams}`;

  try {
    // 🌦️ Requisições paralelas
    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl)
    ]);

    // ❌ Verificação de falhas HTTP
    if (!currentRes.ok || !forecastRes.ok) {
      const currentText = await currentRes.text();
      const forecastText = await forecastRes.text();
      throw new Error(`Erro nas respostas da API: ${currentText} | ${forecastText}`);
    }

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    // 🧪 Validação dos dados recebidos
    if (currentData.cod !== 200 || !currentData.main || !currentData.weather) {
      throw new Error('Dados incompletos recebidos da API (clima atual).');
    }

    if (forecastData.cod !== "200" || !Array.isArray(forecastData.list)) {
      throw new Error('Dados incompletos recebidos da API (previsão).');
    }

    // ✅ Sucesso
    return {
      statusCode: 200,
      body: JSON.stringify({
        ...currentData,
        forecast: forecastData
      })
    };
  } catch (error) {
    console.error('Erro na função getWeather:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: true,
        message: `Erro ao buscar clima: ${error.message}`
      })
    };
  }
};

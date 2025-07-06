const fetch = require('node-fetch');

// 🧠 Cache em memória
let cachedWeather = null;
let cacheTimestamp = null;
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hora

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

  const now = Date.now();

  // ✅ Retorna do cache se ainda estiver válido
  if (
    cachedWeather &&
    cacheTimestamp &&
    now - cacheTimestamp < CACHE_DURATION_MS &&
    cachedWeather.lat === lat &&
    cachedWeather.lon === lon
  ) {
    return {
      statusCode: 200,
      body: JSON.stringify(cachedWeather.data)
    };
  }

  const params = `lat=${lat}&lon=${lon}&units=metric&appid=${weatherApiKey}&lang=pt_br`;
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?${params}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?${params}`;
  const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${weatherApiKey}`;
  const airUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${weatherApiKey}`;

  try {
    // 🔄 Requisições paralelas
    const [currentRes, forecastRes, uvRes, airRes] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl),
      fetch(uvUrl),
      fetch(airUrl)
    ]);

    if (!currentRes.ok || !forecastRes.ok || !uvRes.ok || !airRes.ok) {
      throw new Error('Erro em uma ou mais requisições da API OpenWeather.');
    }

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();
    const uvData = await uvRes.json();
    const airData = await airRes.json();

    if (currentData.cod !== 200 || !currentData.main || !currentData.weather) {
      throw new Error('Dados incompletos recebidos da API (clima atual).');
    }

    if (forecastData.cod !== "200" || !Array.isArray(forecastData.list)) {
      throw new Error('Dados incompletos recebidos da API (previsão).');
    }

    const uv = typeof uvData.value === 'number' ? uvData.value.toFixed(1) : 'indisponível';
    const aqi = airData.list?.[0]?.main?.aqi;
    const qualidadeAr = {
      1: 'Boa',
      2: 'Razoável',
      3: 'Moderada',
      4: 'Ruim',
      5: 'Muito ruim'
    }[aqi] || 'Desconhecida';

    const combinedData = {
      ...currentData,
      forecast: forecastData,
      extras: {
        uv,
        aqi: qualidadeAr
      }
    };

    // 💾 Atualiza cache
    cachedWeather = {
      lat,
      lon,
      data: combinedData
    };
    cacheTimestamp = now;

    return {
      statusCode: 200,
      body: JSON.stringify(combinedData)
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

const fetch = require('node-fetch');
const { DateTime } = require('luxon');

let cachedWeather = null;
let cacheTimestamp = null;
const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutos

exports.handler = async (event) => {
  const { lat, lon, force } = event.queryStringParameters || {};

  if (!lat || !lon) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: true, message: 'Latitude e longitude são obrigatórios.' })
    };
  }

  const now = DateTime.now().setZone('America/Sao_Paulo');
  const currentHour = now.toFormat("yyyy-MM-dd'T'HH"); // Ex: '2025-07-22T15'
  const timestamp = now.toMillis();

  const isCacheValid = (
    !force &&
    cachedWeather &&
    cacheTimestamp &&
    timestamp - cacheTimestamp < CACHE_DURATION_MS &&
    cachedWeather.lat === lat &&
    cachedWeather.lon === lon
  );

  if (isCacheValid) {
    return {
      statusCode: 200,
      body: JSON.stringify(cachedWeather.data)
    };
  }

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,uv_index,weather_code,relative_humidity_2m&hourly=temperature_2m,weather_code,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=5&timezone=auto`;
  const airUrl = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${process.env.WAQI_TOKEN}`;

  try {
    const [weatherRes, airRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(airUrl)
    ]);

    const weatherData = await weatherRes.json();
    const airData = await airRes.json();

    const current = weatherData?.current;
    if (!current) throw new Error('Dados climáticos indisponíveis.');

    const uv = Number.isFinite(current.uv_index)
      ? current.uv_index.toFixed(1)
      : 'indisponível';

    const aqiRaw = airData?.status === 'ok' && Number.isFinite(airData?.data?.aqi)
      ? airData.data.aqi
      : null;

    const aqiEmoji = aqiRaw != null
      ? interpretAqi(aqiRaw)
      : '❓ Desconhecida';

    const hourlyTemps = weatherData?.hourly?.temperature_2m || [];
    const hourlyCodes = weatherData?.hourly?.weather_code || [];
    const hourlyHumidity = weatherData?.hourly?.relative_humidity_2m || [];
    const hourlyTimes = weatherData?.hourly?.time || [];

    const currentIndex = hourlyTimes.findIndex(t => t.startsWith(currentHour));
    const forecast = [];

    for (let i = 1; i <= 4; i++) {
      const index = currentIndex + i * 4;
      if (
        hourlyTemps[index] != null &&
        hourlyCodes[index] != null &&
        hourlyHumidity[index] != null
      ) {
        forecast.push({
          temperatura: hourlyTemps[index],
          weatherCode: hourlyCodes[index],
          umidade: hourlyHumidity[index],
          umidadeNivel: classificarUmidade(hourlyHumidity[index])
        });
      }
    }

    const dailyTempsMax = weatherData?.daily?.temperature_2m_max || [];
    const dailyTempsMin = weatherData?.daily?.temperature_2m_min || [];
    const dailyCodes = weatherData?.daily?.weather_code || [];
    const dailyTimes = weatherData?.daily?.time || [];

    const proximosDias = [];
    for (let i = 1; i <= 4; i++) {
      if (dailyTimes[i] && dailyCodes[i] != null && dailyTempsMax[i] != null && dailyTempsMin[i] != null) {
        proximosDias.push({
          data: formatDate(dailyTimes[i]),
          temperatura: (dailyTempsMax[i] + dailyTempsMin[i]) / 2,
          weatherCode: dailyCodes[i]
        });
      }
    }

    const combinedData = {
      temperatura: current.temperature_2m,
      umidade: current.relative_humidity_2m,
      umidadeNivel: classificarUmidade(current.relative_humidity_2m),
      uv,
      weatherCode: current.weather_code,
      aqi: aqiEmoji,
      previsoes: forecast,
      proximosDias
    };

    cachedWeather = { lat, lon, data: combinedData };
    cacheTimestamp = timestamp;

    return {
      statusCode: 200,
      body: JSON.stringify(combinedData)
    };
  } catch (error) {
    console.error('Erro ao buscar dados climáticos:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: true,
        message: error.message,
        timestamp: DateTime.now().setZone('America/Sao_Paulo').toISO()
      })
    };
  }
};

// 🎭 Interpretação da qualidade do ar (AQI)
function interpretAqi(value) {
  const score = Math.floor(value / 50);
  return {
    0: '🟢 Excelente',
    1: '😃 Boa',
    2: '🙂 Razoável',
    3: '😌 Moderada',
    4: '😟 Ruim',
    5: '😡 Muito ruim'
  }[score] || '❓ Desconhecida';
}

// 📅 Formata data YYYY-MM-DD para "DD de [mês por extenso]"
function formatDate(iso) {
  const dt = DateTime.fromISO(iso, { zone: 'America/Sao_Paulo' });
  const meses = [
    'jan', 'fev', 'març', 'abril',
    'maio', 'junho', 'julho', 'agosto',
    'set', 'out', 'nov', 'dez'
  ];
  return `${dt.day} de ${meses[dt.month - 1]}`;
}

// 💧 Classifica a umidade em baixa, média ou alta
function classificarUmidade(valor) {
  if (valor <= 39) return ''; // valores correspondentes a baixa, média e alta
  if (valor <= 60) return '';
  return '';
}

const fetch = require('node-fetch');

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

  const now = new Date();
  const currentIsoHour = now.toISOString().slice(0, 13); // Ex: '2025-07-22T15'
  const timestamp = now.getTime();

  if (
    !force &&
    cachedWeather &&
    cacheTimestamp &&
    timestamp - cacheTimestamp < CACHE_DURATION_MS &&
    cachedWeather.lat === lat &&
    cachedWeather.lon === lon
  ) {
    return {
      statusCode: 200,
      body: JSON.stringify(cachedWeather.data)
    };
  }

  // ✅ Adicionamos umidade atual e horária
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
    const hourlyTemps = weatherData?.hourly?.temperature_2m || [];
    const hourlyCodes = weatherData?.hourly?.weather_code || [];
    const hourlyHumidity = weatherData?.hourly?.relative_humidity_2m || [];
    const hourlyTimes = weatherData?.hourly?.time || [];

    const dailyTempsMax = weatherData?.daily?.temperature_2m_max || [];
    const dailyTempsMin = weatherData?.daily?.temperature_2m_min || [];
    const dailyCodes = weatherData?.daily?.weather_code || [];
    const dailyTimes = weatherData?.daily?.time || [];

    if (!current) throw new Error('Dados climáticos indisponíveis.');

    // 🌞 Índice UV tratado
    const uv = Number.isFinite(current.uv_index)
      ? current.uv_index.toFixed(1)
      : 'indisponível';

    // 🌫️ Qualidade do ar
    const aqiRaw = airData?.data?.aqi;
    const aqiEmoji = Number.isFinite(aqiRaw)
      ? interpretAqi(aqiRaw)
      : '❓ Desconhecida';

    // ⏩ Previsão horária baseada no horário atual
    const currentIndex = hourlyTimes.findIndex(t => t.startsWith(currentIsoHour));
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
          umidade: hourlyHumidity[index]
        });
      }
    }

    // 🗓️ Previsão dos próximos 4 dias
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
      body: JSON.stringify({ error: true, message: error.message })
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
  const [ano, mes, dia] = iso.split('-');
  const meses = [
    'janeiro', 'fevereiro', 'março', 'abril',
    'maio', 'junho', 'julho', 'agosto',
    'setembro', 'outubro', 'novembro', 'dezembro'
  ];
  const nomeMes = meses[parseInt(mes, 10) - 1];
  return `${dia} de ${nomeMes}`;
}

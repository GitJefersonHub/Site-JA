// Importa funções auxiliares
import { getUvIndexDescription } from './utils.js';
import { getTemperatureFeelingIcon } from './utils.js';
import { aplicarTemaAutomatico } from './tema.js';
import { getNextHoliday } from './feriados.js';
import { getWeatherIcon, formatTwoDigits } from './utils.js';

async function getWeather(latitude, longitude) {
  try {
    aplicarTemaAutomatico();

    const timestamp = Date.now();
    const weatherRes = await fetch(`/.netlify/functions/getWeather?lat=${latitude}&lon=${longitude}&force=true&t=${timestamp}`);
    if (!weatherRes.ok) throw new Error(await weatherRes.text());
    const weatherData = await weatherRes.json();

    const current = weatherData;
    const forecast = weatherData.forecast;
    const extras = weatherData.extras || { uv: 'indisponível', aqi: 'indisponível' };

    if (!current.main || !current.weather || !forecast?.list) throw new Error();

    const [selicRateRes, dollarRes, euroRes, holidayText] = await Promise.allSettled([
      fetch('/.netlify/functions/getSelicRate').then(res => res.json()),
      fetch('/.netlify/functions/getExchangeRate?currency=USD').then(res => res.json()),
      fetch('/.netlify/functions/getExchangeRate?currency=EUR').then(res => res.json()),
      getNextHoliday(latitude, longitude)
    ]);

    const temperature = current.main.temp.toFixed(1);
    const description = current.weather[0].description;
    const icon = getWeatherIcon(description);
    const city = current.name;

    const now = new Date();
    const localTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const day = now.toLocaleDateString('pt-BR', { day: 'numeric' });
    const month = now.toLocaleDateString('pt-BR', { month: 'long' });
    const year = now.getFullYear();
    const formattedDate = `${day} de ${month} de ${year}.`;

    const hourlyForecast = forecast.list
      .filter(item => new Date(item.dt_txt) > now)
      .slice(0, 6)
      .map(item => {
        const date = new Date(item.dt_txt);
        const hour = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const temp = item.main.temp.toFixed(1);
        const desc = item.weather[0].description;
        return `🕒${hour}: ${getTemperatureFeelingIcon(temp)}${temp} °C ${getWeatherIcon(desc)}${desc}`;
      }).join('<br>');

    const forecastByDay = {};
    forecast.list.forEach(item => {
      const date = new Date(item.dt_txt);
      const key = date.toLocaleDateString('pt-BR');
      if (!forecastByDay[key]) forecastByDay[key] = { temps: [], descriptions: [] };
      forecastByDay[key].temps.push(item.main.temp);
      forecastByDay[key].descriptions.push(item.weather[0].description);
    });

    const forecastHtml = Object.entries(forecastByDay)
      .slice(0, 6)
      .map(([dateStr, data]) => {
        const date = new Date(dateStr.split('/').reverse().join('-'));
        const formatted = date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
        const min = Math.min(...data.temps).toFixed(1);
        const max = Math.max(...data.temps).toFixed(1);
        const icon = getWeatherIcon(data.descriptions[0]);
        return `🗓 ${formatted}: (${formatTwoDigits(min)} / ${formatTwoDigits(max)}) °C ${icon}`;
      }).join('<br>');

    const selic = selicRateRes.status === 'fulfilled' && typeof selicRateRes.value?.selic === 'number'
      ? `${selicRateRes.value.selic.toFixed(2)}% ao ano` : null;

    const dollar = dollarRes.status === 'fulfilled' && typeof dollarRes.value?.brl === 'number'
      ? `R$ ${dollarRes.value.brl.toFixed(2)}` : null;

    const euro = euroRes.status === 'fulfilled' && typeof euroRes.value?.brl === 'number'
      ? `R$ ${euroRes.value.brl.toFixed(2)}` : null;

    const feriado = holidayText.status === 'fulfilled' ? holidayText.value : null;

    // 🔧 Novo renderizador com verificação
    let html = '';

    if (city && formattedDate) {
      html += `${city}, ${formattedDate}<br>`;
    }

    if (feriado) {
      html += `${feriado}<br>`;
    }

    if (temperature && description && icon) {
      html += `Previsão para hoje:<br>🕒${localTime}: ${getTemperatureFeelingIcon(temperature)}${temperature} °C ${icon}${description}<br>`;
    }

    if (hourlyForecast) {
      html += `${hourlyForecast}<br>`;
    }

    if (extras.uv && extras.uv !== 'indisponível') {
      html += `💡 Índice UV: ${extras.uv} ${getUvIndexDescription(extras.uv)}<br>`;
    }

    if (extras.aqi && extras.aqi !== 'indisponível') {
      html += `🌫️ Qualidade do ar: ${extras.aqi}<br>`;
    }

    if (selic) {
      html += `💰 Taxa SELIC: ${selic}<br>`;
    }

    if (dollar) {
      html += `💵 Dólar: ${dollar}<br>`;
    }

    if (euro) {
      html += `💶 Euro: ${euro}<br>`;
    }

    if (forecastHtml) {
      html += `Próximos dias (Min / Max):<br>${forecastHtml}<br>`;
    }

    document.getElementById('weather').innerHTML = html || 'Dados não disponíveis no momento.';
  } catch (error) {
    console.error('Erro ao obter dados:', error);
    document.getElementById('weather').innerHTML = 'Ambiente em manutenção.';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      pos => getWeather(pos.coords.latitude, pos.coords.longitude),
      () => document.getElementById('weather').innerHTML = 'Localização não permitida.'
    );
  } else {
    document.getElementById('weather').innerHTML = 'Geolocalização não suportada.';
  }
});

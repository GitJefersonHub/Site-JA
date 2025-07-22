import {
  getUvIndexDescription,
  getTemperatureFeelingIcon,
  getWeatherCodeIcon,
  formatTwoDigits
} from './utils.js';
import { aplicarTemaAutomatico } from './tema.js';
import { getNextHoliday } from './feriados.js';

async function getWeather(latitude, longitude) {
  try {
    aplicarTemaAutomatico();

    const timestamp = Date.now();
    const weatherRes = await fetch(`/.netlify/functions/getWeather?lat=${latitude}&lon=${longitude}&force=true&t=${timestamp}`);
    if (!weatherRes.ok) throw new Error(await weatherRes.text());
    const weatherData = await weatherRes.json();

    const { temperatura, uv, weatherCode, aqi, previsoes, proximosDias } = weatherData;

    const now = new Date();
    const localHour = now.getHours();
    const localTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const day = now.toLocaleDateString('pt-BR', { day: 'numeric' });
    const month = now.toLocaleDateString('pt-BR', { month: 'long' });
    const year = now.getFullYear();
    const formattedDate = `${day} de ${month} de ${year}.`;

    const [selicRateRes, dollarRes, euroRes, holidayText] = await Promise.allSettled([
      fetch('/.netlify/functions/getSelicRate').then(res => res.json()),
      fetch('/.netlify/functions/getExchangeRate?currency=USD').then(res => res.json()),
      fetch('/.netlify/functions/getExchangeRate?currency=EUR').then(res => res.json()),
      getNextHoliday(latitude, longitude)
    ]);

    const selic = selicRateRes.status === 'fulfilled' && typeof selicRateRes.value?.selic === 'number'
      ? `${selicRateRes.value.selic.toFixed(2)}% ao ano` : null;

    const dollar = dollarRes.status === 'fulfilled' && typeof dollarRes.value?.brl === 'number'
      ? `R$ ${dollarRes.value.brl.toFixed(2)}` : null;

    const euro = euroRes.status === 'fulfilled' && typeof euroRes.value?.brl === 'number'
      ? `R$ ${euroRes.value.brl.toFixed(2)}` : null;

    const feriado = holidayText.status === 'fulfilled' ? holidayText.value : null;

    let html = `${formattedDate}<br>`;

    if (feriado) {
      html += `${feriado}<br>`;
    }

    if (temperatura && weatherCode !== undefined) {
      html += `<strong>🕒 Próximas horas:</strong><br>`;
      html += `🕒${localTime}: ${getTemperatureFeelingIcon(temperatura)}${temperatura.toFixed(1)} °C ${getWeatherCodeIcon(weatherCode)}<br>`;
    }

    if (previsoes?.length === 4) {
      previsoes.forEach((p, i) => {
        const futureHour = (localHour + (i + 1) * 4) % 24;
        const formattedHour = formatTwoDigits(futureHour);
        html += `⏩ ${formattedHour}h: ${getTemperatureFeelingIcon(p.temperatura)}${p.temperatura.toFixed(1)} °C ${getWeatherCodeIcon(p.weatherCode)}<br>`;
      });
    }

    if (uv && uv !== 'indisponível') {
      html += `💡 Índice UV: ${uv} ${getUvIndexDescription(uv)}<br>`;
    }

    if (aqi) {
      html += `🌫️ Qualidade do ar: ${aqi}<br>`;
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

    // 🌤️ Previsão dos próximos 4 dias
    if (proximosDias?.length === 4) {
      html += `<strong>📆 Média dos próximos dias:</strong><br>`;
      proximosDias.forEach(dia => {
        html += `📅 ${dia.data}: ${getTemperatureFeelingIcon(dia.temperatura)}${dia.temperatura.toFixed(1)} °C ${getWeatherCodeIcon(dia.weatherCode)}<br>`;
      });
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

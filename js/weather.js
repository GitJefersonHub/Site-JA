// Importa funções auxiliares
import { getUvIndexDescription } from './utils.js';
import { getTemperatureFeelingIcon } from './utils.js';
import { aplicarTemaAutomatico } from './tema.js'; // Aplica tema escuro com base no horário
import { getNextHoliday } from './feriados.js';    // Busca o próximo feriado via API
import { getWeatherIcon, formatTwoDigits } from './utils.js'; // Ícones e formatação

// Função principal que busca e exibe dados climáticos, econômicos e de feriados
async function getWeather(latitude, longitude) {
  try {
    aplicarTemaAutomatico(); // Aplica tema escuro se for noite

    // Força atualização dos dados ignorando cache
    const timestamp = Date.now();
    const weatherRes = await fetch(`/.netlify/functions/getWeather?lat=${latitude}&lon=${longitude}&force=true&t=${timestamp}`);
    if (!weatherRes.ok) throw new Error(await weatherRes.text());
    const weatherData = await weatherRes.json();

    // Extrai dados principais da resposta
    const current = weatherData;
    const forecast = weatherData.forecast;
    const extras = weatherData.extras || { uv: 'indisponível', aqi: 'indisponível' };

    // Verifica se os dados essenciais estão presentes
    if (!current.main || !current.weather || !forecast?.list) throw new Error();

    // Busca dados econômicos e feriado em paralelo
    const [selicRateRes, dollarRes, euroRes, holidayText] = await Promise.allSettled([
      fetch('/.netlify/functions/getSelicRate').then(res => res.json()),
      fetch('/.netlify/functions/getExchangeRate?currency=USD').then(res => res.json()),
      fetch('/.netlify/functions/getExchangeRate?currency=EUR').then(res => res.json()),
      getNextHoliday(latitude, longitude)
    ]);

    // Dados atuais do clima
    const temperature = current.main.temp.toFixed(1);
    const description = current.weather[0].description;
    const icon = getWeatherIcon(description);
    const city = current.name;

    // Data e hora local formatadas
    const now = new Date();
    const localTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const day = now.toLocaleDateString('pt-BR', { day: 'numeric' });
    const month = now.toLocaleDateString('pt-BR', { month: 'long' });
    const year = now.getFullYear();
    const formattedDate = `${day} de ${month} de ${year}.`;

    // Previsão por hora (próximas 7 horas)
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

    // Agrupa previsão por dia (data local)
    const forecastByDay = {};
    forecast.list.forEach(item => {
      const date = new Date(item.dt_txt);
      const key = date.toLocaleDateString('pt-BR'); // Ex: "08/07/2025"
      if (!forecastByDay[key]) forecastByDay[key] = { temps: [], descriptions: [] };
      forecastByDay[key].temps.push(item.main.temp);
      forecastByDay[key].descriptions.push(item.weather[0].description);
    });

    // Monta HTML da previsão dos próximos dias (ex: "8 de julho")
    const forecastHtml = Object.entries(forecastByDay)
      .slice(0, 6)
      .map(([dateStr, data]) => {
        const date = new Date(dateStr.split('/').reverse().join('-')); // Converte para Date
        const formatted = date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
        const min = Math.min(...data.temps).toFixed(1);
        const max = Math.max(...data.temps).toFixed(1);
        const icon = getWeatherIcon(data.descriptions[0]);
        return `🗓 ${formatted}: (${formatTwoDigits(min)} / ${formatTwoDigits(max)}) °C ${icon}`;
      }).join('<br>');

    // Dados econômicos formatados
    const selic = selicRateRes.status === 'fulfilled' && typeof selicRateRes.value?.selic === 'number'
      ? `${selicRateRes.value.selic.toFixed(2)}% ao ano` : 'indisponível';

    const dollar = dollarRes.status === 'fulfilled' && typeof dollarRes.value?.brl === 'number'
      ? `R$ ${dollarRes.value.brl.toFixed(2)}` : 'indisponível';

    const euro = euroRes.status === 'fulfilled' && typeof euroRes.value?.brl === 'number'
      ? `R$ ${euroRes.value.brl.toFixed(2)}` : 'indisponível';

    const feriado = holidayText.status === 'fulfilled' ? holidayText.value : '🗓 Feriado indisponível.';

    // Atualiza o conteúdo da página com todos os dados
    document.getElementById('weather').innerHTML = `
      ${city}, ${formattedDate}<br><br>
      ${feriado}<br><br>
      Previsão para hoje:<br>
      🕒${localTime}: ${getTemperatureFeelingIcon(temperature)}${temperature} °C ${icon}${description}<br>

      ${hourlyForecast}<br>
      💡 Índice UV: ${extras.uv} ${getUvIndexDescription(extras.uv)}<br>
      🌫️ Qualidade do ar: ${extras.aqi}<br>
      💰 Taxa SELIC: ${selic}<br>
      💵 Dólar: ${dollar}<br>
      💶 Euro: ${euro}<br><br>
      Próximos dias (Min / Max):<br>
      ${forecastHtml}<br>
    `;
  } catch (error) {
    console.error('Erro ao obter dados:', error);
    document.getElementById('weather').innerHTML = 'Ambiente em manutenção.';
  }
}

// Ao carregar a página, obtém a localização do usuário e inicia a busca
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

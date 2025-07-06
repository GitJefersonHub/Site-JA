// Retorna emoji baseado na descrição do clima
function getWeatherIcon(description) {
  const desc = description.toLowerCase();
  if (desc.includes('céu limpo')) return '☀️';
  if (desc.includes('nublado') && !desc.includes('parcial')) return '☁️';
  if (desc.includes('algumas nuvens') || desc.includes('parcial')) return '⛅';
  if (desc.includes('chuva leve')) return '🌦️';
  if (desc.includes('chuva') || desc.includes('tempestade')) return '🌧️';
  if (desc.includes('neve')) return '❄️';
  if (desc.includes('névoa') || desc.includes('neblina')) return '🌫️';
  return '🌡️';
}

// Aplica tema escuro se for noite
function aplicarTemaAutomatico() {
  const hora = new Date().getHours();
  const body = document.body;
  if (hora < 6 || hora >= 18) {
    body.classList.add('tema-escuro');
  } else {
    body.classList.remove('tema-escuro');
  }
}

// Busca próximo feriado com base na localização
async function getNextHoliday(lat, lon) {
  try {
    const res = await fetch(`/.netlify/functions/getHoliday?lat=${lat}&lon=${lon}`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.message || '📅 Feriado indisponível.';
  } catch {
    return '📅 Feriado indisponível.';
  }
}

// Formata número com dois dígitos
const formatTwoDigits = value => parseInt(value).toString().padStart(2, '0');

// Busca dados climáticos e econômicos e atualiza o DOM
async function getWeather(latitude, longitude) {
  try {
    aplicarTemaAutomatico();

    const weatherRes = await fetch(`/.netlify/functions/getWeather?lat=${latitude}&lon=${longitude}`);
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
    const weekday = now.toLocaleDateString('pt-BR', { weekday: 'long' });
    const formattedDate = `${day} de ${month} de ${year} (${weekday})`;

    const hourlyForecast = forecast.list
      .filter(item => new Date(item.dt_txt) > now)
      .slice(0, 5)
      .map(item => {
        const date = new Date(item.dt_txt);
        const hour = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const temp = item.main.temp.toFixed(1);
        const desc = item.weather[0].description;
        return `🕒 ${hour}: ${temp} °C ${getWeatherIcon(desc)} ${desc}`;
      }).join('<br>');

    const forecastByDay = {};
    forecast.list.forEach(item => {
      const date = new Date(item.dt_txt).toISOString().split('T')[0];
      if (!forecastByDay[date]) forecastByDay[date] = { temps: [], descriptions: [] };
      forecastByDay[date].temps.push(item.main.temp);
      forecastByDay[date].descriptions.push(item.weather[0].description);
    });

    const forecastHtml = Object.entries(forecastByDay)
      .slice(0, 6)
      .map(([dateStr, data]) => {
        const date = new Date(dateStr);
        const dayOfWeek = date.toLocaleDateString('pt-BR', { weekday: 'long' });
        const min = Math.min(...data.temps).toFixed(1);
        const max = Math.max(...data.temps).toFixed(1);
        const icon = getWeatherIcon(data.descriptions[0]);
        return `📆 ${dayOfWeek}: (${formatTwoDigits(min)} / ${formatTwoDigits(max)}) °C ${icon}`;
      }).join('<br>');

    const selic = selicRateRes.status === 'fulfilled' && typeof selicRateRes.value?.selic === 'number'
      ? `${selicRateRes.value.selic.toFixed(2)}% ao ano` : 'indisponível';

    const dollar = dollarRes.status === 'fulfilled' && typeof dollarRes.value?.brl === 'number'
      ? `R$ ${dollarRes.value.brl.toFixed(2)}` : 'indisponível';

    const euro = euroRes.status === 'fulfilled' && typeof euroRes.value?.brl === 'number'
      ? `R$ ${euroRes.value.brl.toFixed(2)}` : 'indisponível';

    const feriado = holidayText.status === 'fulfilled' ? holidayText.value : '📅 Feriado indisponível.';

    document.getElementById('weather').innerHTML = `
      ${city}, ${formattedDate}<br><br>
      ${feriado}<br><br>
      Previsão para hoje:<br>
      🕒 ${localTime}: ${temperature} °C ${icon} ${description}<br>
      💡 Índice UV: ${extras.uv}<br>
      🌫️ Qualidade do ar: ${extras.aqi}<br><br>
      ${hourlyForecast}<br><br>
      💰 Taxa SELIC: ${selic}<br>
      💵 Dólar: ${dollar}<br>
      💶 Euro: ${euro}<br><br>
      Próximos dias (Min/Max):<br>
      ${forecastHtml}<br>
    `;
  } catch (error) {
    console.error('Erro ao obter dados:', error);
    document.getElementById('weather').innerHTML = 'Ambiente em manutenção.';
  }
}

// Obtém localização ao carregar a página
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

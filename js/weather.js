async function getNextHoliday(lat, lon) {
  try {
    const res = await fetch(`/.netlify/functions/getHoliday?lat=${lat}&lon=${lon}`);
    if (!res.ok) throw new Error('Erro ao buscar feriados');
    const data = await res.json();
    return data.message || '📅 Feriado indisponível.';
  } catch (err) {
    console.error('Erro ao obter feriado:', err);
    return '📅 Feriado indisponível.';
  }
}

// 🔄 Fallbacks visuais
const showLoading = () => {
  document.getElementById('loading').style.display = 'block';
  document.getElementById('error').style.display = 'none';
  document.getElementById('weather-content').style.display = 'none';
  document.getElementById('weather-default').style.display = 'none';
};

const showError = (message) => {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('error').textContent = message;
  document.getElementById('error').style.display = 'block';
  document.getElementById('weather-content').style.display = 'none';
  document.getElementById('weather-default').style.display = 'none';
};

const showWeather = (html) => {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('error').style.display = 'none';
  const content = document.getElementById('weather-content');
  content.innerHTML = html;
  content.style.display = 'block';
  document.getElementById('weather-default').style.display = 'none';
};

// 💾 Cache local
const loadCachedWeather = () => {
  const cached = localStorage.getItem('cachedWeather');
  if (cached) {
    const { html, timestamp } = JSON.parse(cached);
    const age = (Date.now() - timestamp) / 1000 / 60; // minutos
    if (age < 60) {
      showWeather(html + '<br><small>⏳ Dados em cache</small>');
      return true;
    }
  }
  return false;
};

async function getWeather(latitude, longitude) {
  showLoading();

  if (loadCachedWeather()) return;

  try {
    const weatherRes = await fetch(`/.netlify/functions/getWeather?lat=${latitude}&lon=${longitude}`);
    if (!weatherRes.ok) {
      const errorText = await weatherRes.text();
      throw new Error(`Erro na API do clima: ${errorText}`);
    }

    const weatherData = await weatherRes.json();
    const current = weatherData;
    const forecast = weatherData.forecast;

    if (!current.main || !current.weather || !forecast || !forecast.list) {
      throw new Error("Dados incompletos recebidos da API.");
    }

    const [selicRateRes, dollarRes, euroRes, holidayRes] = await Promise.allSettled([
      fetch('/.netlify/functions/getSelicRate').then(res => res.json()),
      fetch('/.netlify/functions/getExchangeRate?currency=USD').then(res => res.json()),
      fetch('/.netlify/functions/getExchangeRate?currency=EUR').then(res => res.json()),
      getNextHoliday(latitude, longitude)
    ]);

    const temperature = current.main.temp.toFixed(1);
    const description = current.weather[0].description;
    const city = current.name;

    const forecastHtml = forecast.list
      .filter(item => item.dt_txt.includes("12:00:00"))
      .slice(0, 2)
      .map(day => {
        const date = new Date(day.dt * 1000);
        const dayOfWeek = date.toLocaleDateString('pt-BR', { weekday: 'long' });
        const temp = day.main.temp.toFixed(1);
        const desc = day.weather[0].description;
        return `${dayOfWeek}: ${temp}°C / ${desc}`;
      }).join('<br>');

    const selic = selicRateRes.status === 'fulfilled' && typeof selicRateRes.value?.selic === 'number'
      ? `${selicRateRes.value.selic.toFixed(2)}% ao ano`
      : 'indisponível';

    const dollar = dollarRes.status === 'fulfilled' && typeof dollarRes.value?.brl === 'number'
      ? `R$ ${dollarRes.value.brl.toFixed(2)}`
      : 'indisponível';

    const euro = euroRes.status === 'fulfilled' && typeof euroRes.value?.brl === 'number'
      ? `R$ ${euroRes.value.brl.toFixed(2)}`
      : 'indisponível';

    const feriado = holidayRes.status === 'fulfilled' ? holidayRes.value : '📅 Feriado indisponível.';

    const html = `
      ${city}, ${new Date().toLocaleDateString('pt-BR')}<br>
      ${feriado}<br><br>
      hoje: ${temperature}°C / ${description}<br>
      * Taxa SELIC: ${selic}<br>
      * Dólar: ${dollar}<br>
      * Euro: ${euro}<br><br>
      ${forecastHtml}
    `;

    showWeather(html);

    // 💾 Salvar no cache
    localStorage.setItem('cachedWeather', JSON.stringify({
      html,
      timestamp: Date.now()
    }));

  } catch (error) {
    console.error('Erro ao obter dados:', error);
    if (!loadCachedWeather()) {
      showError('⚠️ Ambiente em manutenção.');
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  // Exibe o conteúdo padrão imediatamente
  document.getElementById('weather-default').style.display = 'block';

  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      position => {
        // Oculta o conteúdo padrão somente após o usuário permitir
        document.getElementById('weather-default').style.display = 'none';
        const { latitude, longitude } = position.coords;
        getWeather(latitude, longitude);
      },
      error => {
        console.error('Erro ao obter localização:', error);
        // Mantém o conteúdo padrão visível e exibe erro
        showError('⚠️ Localização não permitida.');
      }
    );
  } else {
    showError('⚠️ Geolocalização não suportada.');
  }
});

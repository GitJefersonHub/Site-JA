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

async function getWeather(latitude, longitude) {
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

    const [selicRateRes, dollarRes, euroRes, holidayText] = await Promise.allSettled([
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

    const feriado = holidayText.status === 'fulfilled' ? holidayText.value : '📅 Feriado indisponível.';

    document.getElementById('weather').innerHTML = `
      ${city}, ${new Date().toLocaleDateString('pt-BR')}<br>
      ${feriado}<br><br>
      hoje: ${temperature}°C / ${description}<br>
      * Taxa SELIC: ${selic}<br>
      * Dólar: ${dollar}<br>
      * Euro: ${euro}<br><br>
      ${forecastHtml}
      
    `;
  } catch (error) {
    console.error('Erro ao obter dados:', error);
    document.getElementById('weather').innerHTML = 'Ambiente em manutenção.';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        getWeather(latitude, longitude);
      },
      error => {
        console.error('Erro ao obter localização:', error);
        document.getElementById('weather').innerHTML = 'Localização não permitida.';
      }
    );
  } else {
    document.getElementById('weather').innerHTML = 'Geolocalização não suportada.';
  }
});

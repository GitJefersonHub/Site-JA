  function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          getWeather(position.coords.latitude, position.coords.longitude);
        }, () => {
          document.getElementById('weather').innerHTML =
            'Não foi possível acessar a localização.';
        });
      } else {
        document.getElementById('weather').innerHTML =
          'Seu navegador não suporta geolocalização.';
      }
    }
    async function getWeather(latitude, longitude) {
  try {
    // Chamada para função serverless getWeather
    const weatherRes = await fetch(`/.netlify/functions/getWeather?lat=${latitude}&lon=${longitude}`);
    const weatherData = await weatherRes.json();
    const current = weatherData.weather;
    const forecast = weatherData.forecast;

    // Chamada para cotação do dólar e euro
    const [selicRateRes, dollarRes, euroRes] = await Promise.all([
      fetch('/.netlify/functions/getSelicRate').then(res => res.json()),
      fetch('/.netlify/functions/getExchangeRate?currency=USD').then(res => res.json()),
      fetch('/.netlify/functions/getExchangeRate?currency=EUR').then(res => res.json()),
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

    document.getElementById('weather').innerHTML = `
      ${city}, ${new Date().toLocaleDateString('pt-BR')}<br>
      hoje: ${temperature}°C / ${description}<br>
      ${forecastHtml}<br>
      * Taxa SELIC: ${selicRateRes.selic.toFixed(2)}% ao ano.<br>
      * Dólar: R$ ${dollarRes.brl.toFixed(2)}<br>
      * Euro: R$ ${euroRes.brl.toFixed(2)}
    `;
  } catch (error) {
    console.error('Erro ao obter dados:', error);
    document.getElementById('weather').innerHTML = 'Erro ao carregar informações.';
  }
}
    window.onload = getLocation;
  

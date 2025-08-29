import {
  getUvIndexDescription,
  getTemperatureFeelingIcon,
  getWeatherCodeIcon,
  formatTwoDigits
} from './utils.js';
import { aplicarTemaAutomatico } from './tema.js';
import { getNextHoliday } from './feriados.js';

function getUmidadeIcon(nivel) {
  return {
    Baixa: '🔥',
    Média: '💧',
    Alta: '🌊'
  }[nivel] || '💧';
}

async function getEnderecoCompleto(latitude, longitude) {
  const apiKey = 'QBrfgY3EsYz1XbTEv3QEONVkE1niTOHluM5sQhZirt60f26dcuhG4YmrrI9DIpc3'; // Substitua pela sua chave
  const url = `https://api.distancematrix.ai/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}&language=pt-BR`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Erro ao buscar endereço');
  const data = await res.json();

  const endereco = data.results?.[0]?.formatted_address;
  return endereco || 'Endereço não disponível';
}



async function getWeather(latitude, longitude) {
  try {
    aplicarTemaAutomatico();

    const timestamp = Date.now();
    const weatherRes = await fetch(`/.netlify/functions/getWeather?lat=${latitude}&lon=${longitude}&force=true&t=${timestamp}`);
    if (!weatherRes.ok) throw new Error(await weatherRes.text());
    const weatherData = await weatherRes.json();

    const { temperatura, uv, weatherCode, aqi, umidade, umidadeNivel, previsoes, proximosDias } = weatherData;

    const now = new Date();
    const localHour = now.getHours();
    const day = now.toLocaleDateString('pt-BR', { day: 'numeric' });
    const month = now.toLocaleDateString('pt-BR', { month: 'long' });
    const year = now.getFullYear();
    const formattedDate = `${day} de ${month} de ${year}.`;

    const [selicRateRes, dollarRes, euroRes, holidayRes] = await Promise.allSettled([
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

    const tipoFeriado = {
      nacional: '🇧🇷 Nacional',
      estadual: '🏙️ Estadual',
      municipal: '🏘️ Municipal',
      facultativo: '⚠️ Facultativo'
    };

    const feriados = holidayRes.status === 'fulfilled' && Array.isArray(holidayRes.value)
      ? holidayRes.value
      : [];

    const mesAtual = now.getMonth();
    const feriadosDoMes = feriados.filter(f => {
      const dataFeriado = new Date(f.date);
      return dataFeriado.getMonth() === mesAtual;
    });

    let html = `${formattedDate}<br>`;

    if (feriadosDoMes.length > 0) {
      html += `<strong>🗓 Feriados deste mês:</strong><br>`;
      feriadosDoMes.forEach(f => {
        const dataFormatada = new Date(f.date).toLocaleDateString('pt-BR', {
          weekday: 'long', day: '2-digit', month: 'long'
        });

        const tipo = tipoFeriado[f.level] || '🎉 Outro';
        html += `<p><strong>${tipo}</strong>: ${dataFormatada} - ${f.name}</p>`;
      });
      html += `<br>`;
    }

    if (temperatura && weatherCode !== undefined) {
      const horaAtual = now.getHours().toString().padStart(2, '0');
      const umidadeIcone = getUmidadeIcon(umidadeNivel);
      html += `<br><strong>Média das próximas horas:</strong><br>`;
      html += `⏩ ${horaAtual}h: ${getTemperatureFeelingIcon(temperatura)}${temperatura.toFixed(1)} °C ${umidadeIcone} ${umidadeNivel} ${umidade}% ${getWeatherCodeIcon(weatherCode, { temperatura, uv })}<br>`;
    }


    if (previsoes?.length === 4) {
      previsoes.forEach((p, i) => {
        const futureHour = (localHour + (i + 1) * 4) % 24;
        const formattedHour = formatTwoDigits(futureHour);
        const umidadeIcone = getUmidadeIcon(p.umidadeNivel);
        html += `⏩ ${formattedHour}h: ${getTemperatureFeelingIcon(p.temperatura)}${p.temperatura.toFixed(1)} °C ${umidadeIcone} ${p.umidadeNivel} ${p.umidade}% ${getWeatherCodeIcon(p.weatherCode, { temperatura: p.temperatura, uv })}<br>`;
      });
    }


    if (uv && uv !== 'indisponível') {
      html += `<br>💡 Índice UV: ${uv} ${getUvIndexDescription(uv)}<br>`;
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
      html += `💶 Euro: ${euro}<br><br>`;
    }

    if (proximosDias?.length === 4) {
      html += `<strong>Média dos próximos dias:</strong><br>`;
      proximosDias.forEach(dia => {
        html += `🗓 ${dia.data}: ${getTemperatureFeelingIcon(dia.temperatura)}${dia.temperatura.toFixed(1)} °C ${getWeatherCodeIcon(dia.weatherCode, { temperatura: dia.temperatura, uv })}<br>`;
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

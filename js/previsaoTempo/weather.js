import {
  getUvIndexDescription,
  getTemperatureFeelingIcon,
  getWeatherCodeIcon,
  formatTwoDigits
} from './utils.js';
import { aplicarTemaAutomatico } from './tema.js';
import { getNextHoliday } from './feriados.js';
import { getEnderecoCompleto, getUmidadeIcon } from './helpers.js';
import { DateTime } from "https://cdn.jsdelivr.net/npm/luxon@3.4.3/build/es6/luxon.min.js";

export async function getWeather(latitude, longitude) {
  try {
    aplicarTemaAutomatico();

    const timestamp = Date.now();
    const weatherRes = await fetch(`/.netlify/functions/getWeather?lat=${latitude}&lon=${longitude}&force=true&t=${timestamp}`);
    if (!weatherRes.ok) throw new Error(await weatherRes.text());
    const weatherData = await weatherRes.json();

    const { temperatura, uv, weatherCode, aqi, umidade, umidadeNivel, previsoes, proximosDias } = weatherData;

    const now = DateTime.now().setZone('America/Sao_Paulo');
    const localHour = now.hour;
    const formattedDate = now.setLocale('pt-BR').toFormat("dd 'de' LLLL 'de' yyyy");

    const enderecoCompleto = await getEnderecoCompleto(latitude, longitude);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

    const [selicRateRes, dollarRes, euroRes, holidayRes] = await Promise.allSettled([
      fetch('/.netlify/functions/getSelicRate').then(res => res.json()),
      fetch('/.netlify/functions/getExchangeRate?currency=USD').then(res => res.json()),
      fetch('/.netlify/functions/getExchangeRate?currency=EUR').then(res => res.json()),
      getNextHoliday(latitude, longitude)
    ]);

    const tipoFeriado = {
      nacional: 'Feriado: 🇧🇷 Nacional',
      estadual: 'Feriado: 🏙️ Estadual',
      municipal: 'Feriado: 🏘️ Municipal',
      facultativo: 'Feriado: ⚠️ Facultativo'
    };

    const feriados = holidayRes.status === 'fulfilled' && Array.isArray(holidayRes.value)
      ? holidayRes.value
      : [];

    const mesAtual = now.month;

    const feriadosDoMes = feriados.filter(f => {
      const dataFeriado = DateTime.fromISO(f.date, { zone: 'America/Sao_Paulo' });
      return dataFeriado.month === mesAtual;
    });

    let html = `${formattedDate}<br>`;

    if (feriadosDoMes.length > 0) {
      feriadosDoMes.forEach(f => {
        const dataFeriado = DateTime.fromISO(f.date, { zone: 'America/Sao_Paulo' });
        const dataFormatada = dataFeriado.setLocale('pt-BR').toFormat("cccc, dd 'de' LLLL");
        const tipo = tipoFeriado[f.level] || '🎉 Outro';
        html += `<p><strong>${tipo}</strong>: ${dataFormatada} - ${f.name}</p>`;
      });
    }

    html += `
<button class="btn-localDispositivo" onclick="window.open('${mapsUrl}', '_blank')">${enderecoCompleto}
</button>`;

    const selic = selicRateRes.status === 'fulfilled' && typeof selicRateRes.value?.selic === 'number'
      ? `${selicRateRes.value.selic.toFixed(2)}% ao ano` : null;

    const dollar = dollarRes.status === 'fulfilled' && typeof dollarRes.value?.brl === 'number'
      ? `R$ ${dollarRes.value.brl.toFixed(2)}` : null;

    const euro = euroRes.status === 'fulfilled' && typeof euroRes.value?.brl === 'number'
      ? `R$ ${euroRes.value.brl.toFixed(2)}` : null;

    if (temperatura && weatherCode !== undefined) {
      const horaAtual = formatTwoDigits(localHour);
      const umidadeIcone = getUmidadeIcon(umidadeNivel);
      html += `<strong>Previsão para as próximas horas:</strong><br>`;
      html += `⏩ ${horaAtual}h: ${getTemperatureFeelingIcon(temperatura)}${temperatura.toFixed(1)} °C  ${getWeatherCodeIcon(weatherCode, { temperatura, uv })}<br>`; // Trecho referente a umidade da hora atual ( ${umidadeIcone} ${umidadeNivel} ${umidade}% )
    }

    if (previsoes?.length === 4) {
      previsoes.forEach((p, i) => {
        const futureHour = (localHour + (i + 1) * 4) % 24;
        const formattedHour = formatTwoDigits(futureHour);
        const umidadeIcone = getUmidadeIcon(p.umidadeNivel);
        html += `⏩ ${formattedHour}h: ${getTemperatureFeelingIcon(p.temperatura)}${p.temperatura.toFixed(1)} °C ${getWeatherCodeIcon(p.weatherCode, { temperatura: p.temperatura, uv })}<br>`; // Trecho referente a umidade das próximas horas ( ${umidadeIcone} ${p.umidadeNivel} ${p.umidade}% )
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
      html += `<strong>Previsão para os próximos dias:</strong><br>`;
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

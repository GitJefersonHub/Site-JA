const fetch = require('node-fetch');

exports.handler = async (event) => {
  const year = new Date().getFullYear();
  const token = process.env.INVERTEXTO_API_KEY;
  const { lat, lon } = event.queryStringParameters || {};

  if (!token) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: true,
        message: 'Chave da API Invertexto não configurada.'
      })
    };
  }

  if (!lat || !lon) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: true,
        message: 'Latitude e longitude são obrigatórias.'
      })
    };
  }

  try {
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=pt`);
    const geoData = await geoRes.json();

    const city = geoData.address.city || geoData.address.town || geoData.address.village;
    const state = geoData.address.state_code || geoData.address.state;

    if (!city || !state) {
      throw new Error('Não foi possível determinar cidade ou estado a partir da localização.');
    }

    const holidayUrl = `https://api.invertexto.com/v1/holidays/${year}?token=${token}&state=${state}&city=${city}`;
    const holidayRes = await fetch(holidayUrl);

    if (!holidayRes.ok) {
      const errorText = await holidayRes.text();
      throw new Error(`Erro HTTP da API de feriados: ${holidayRes.status} - ${errorText}`);
    }

    const holidays = await holidayRes.json();
    const today = new Date();

    // ✅ Correção: evitar problemas de fuso horário
    const parseDate = (dateStr) => {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    };

    const futureHolidays = holidays
      .map(h => ({ ...h, dateObj: parseDate(h.date) }))
      .filter(h => h.dateObj >= today);

    let monthToCheck = today.getMonth();
    let selectedHolidays = [];

    // 🔁 Procurar o próximo mês com feriados ou datas comemorativas
    while (monthToCheck < 12) {
      selectedHolidays = futureHolidays.filter(h => h.dateObj.getMonth() === monthToCheck);
      if (selectedHolidays.length > 0) break;
      monthToCheck++;
    }

    if (selectedHolidays.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: '📅 Nenhum feriado ou data comemorativa futura encontrada até o final do ano.' })
      };
    }

    const formatHoliday = (h) => {
      const dateStr = h.dateObj.toLocaleDateString('pt-BR');
      const weekday = h.dateObj.toLocaleDateString('pt-BR', { weekday: 'long' });

      // 🏷️ Identificar se é feriado ou comemorativo
      const nivel = {
        facultativo: 'facultativo',
        municipal: 'municipal',
        estadual: 'estadual',
        nacional: 'nacional',
        comemorativo: 'comemorativo'
      }[h.level] || 'feriado';

      return `📅 ${dateStr} (${weekday}) — ${h.name} [${nivel}]`;
    };

    const message = `\n` + selectedHolidays.map(formatHoliday).join('\n');

    return {
      statusCode: 200,
      body: JSON.stringify({ message })
    };
  } catch (err) {
    console.error('Erro ao buscar feriados:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: true,
        message: `Erro ao buscar feriados: ${err.message}`
      })
    };
  }
};

const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { lat, lon } = event.queryStringParameters || {};
  const token = process.env.INVERTEXTO_API_KEY;
  const year = new Date().getFullYear();

  if (!token) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: true, message: 'Chave da API Invertexto não configurada.' })
    };
  }

  if (!lat || !lon) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: true, message: 'Latitude e longitude são obrigatórias.' })
    };
  }

  try {
    // 📍 Busca cidade e estado com base na geolocalização
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=pt`);
    const geoData = await geoRes.json();
    const city = geoData.address.city || geoData.address.town || geoData.address.village;
    const state = geoData.address.state_code || geoData.address.state;

    if (!city || !state) throw new Error('Cidade ou estado não encontrados.');

    // 🗓️ Busca os feriados via Invertexto
    const holidayUrl = `https://api.invertexto.com/v1/holidays/${year}?token=${token}&state=${state}&city=${city}`;
    const holidayRes = await fetch(holidayUrl);
    if (!holidayRes.ok) throw new Error(`Erro HTTP: ${holidayRes.status} - ${await holidayRes.text()}`);

    const holidays = await holidayRes.json();
    const today = new Date();

    // 📆 Converte string para Date
    const parseDate = (str) => {
      const [y, m, d] = str.split('-').map(Number);
      return new Date(y, m - 1, d);
    };

    // 🔍 Filtra feriados futuros que não são comemorativos
    const futureHolidays = holidays
      .map(h => ({ ...h, dateObj: parseDate(h.date) }))
      .filter(h => h.dateObj >= today && h.level !== 'comemorativo');

    // 🔁 Encontra feriados do mês atual (ou próximo disponível)
    let month = today.getMonth();
    let selected = [];
    while (month < 12) {
      selected = futureHolidays.filter(h => h.dateObj.getMonth() === month);
      if (selected.length) break;
      month++;
    }

    if (!selected.length) {
      return {
        statusCode: 200,
        body: JSON.stringify({ holidays: [] })
      };
    }

    // ✅ Retorna nome, data e nível (tipo) do feriado
    const holidaysFormatted = selected.map(h => ({
      name: h.name,
      date: h.date,
      level: h.level
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ holidays: holidaysFormatted })
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

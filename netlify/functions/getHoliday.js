const fetch = require('node-fetch');

exports.handler = async (event) => {
  const year = new Date().getFullYear();
  const token = process.env.INVERTEXTO_API_KEY;
  const { lat, lon } = event.queryStringParameters || {};

  // 🔐 Verificação da chave da API
  if (!token) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: true,
        message: 'Chave da API Invertexto não configurada.'
      })
    };
  }

  // 📍 Validação de coordenadas
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
    // 🌍 Geocodificação reversa
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=pt`);
    const geoData = await geoRes.json();

    const city = geoData.address.city || geoData.address.town || geoData.address.village;
    const state = geoData.address.state_code || geoData.address.state;

    if (!city || !state) {
      throw new Error('Não foi possível determinar cidade ou estado a partir da localização.');
    }

    // 📅 Consulta de feriados
    const holidayUrl = `https://api.invertexto.com/v1/holidays/${year}?token=${token}&state=${state}&city=${city}`;
    const holidayRes = await fetch(holidayUrl);

    if (!holidayRes.ok) {
      const errorText = await holidayRes.text();
      throw new Error(`Erro HTTP da API de feriados: ${holidayRes.status} - ${errorText}`);
    }

    const holidays = await holidayRes.json();

    // 🔎 Filtrar próximo feriado
    const today = new Date();
    const upcoming = holidays
      .map(h => ({ ...h, dateObj: new Date(h.date) }))
      .filter(h => h.dateObj >= today)
      .sort((a, b) => a.dateObj - b.dateObj)[0];

    if (!upcoming) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: '📅 Nenhum feriado próximo encontrado.' })
      };
    }

    const dateStr = upcoming.dateObj.toLocaleDateString('pt-BR');
    const weekday = upcoming.dateObj.toLocaleDateString('pt-BR', { weekday: 'long' });

    const nivelFormatado = {
      facultativo: 'facultativo',
      municipal: 'municipal',
      estadual: 'estadual',
      nacional: 'nacional'
    }[upcoming.level] || 'feriado';

    const description = `📅Feriado ${nivelFormatado}: ${upcoming.name}. ${dateStr} ${weekday}.`;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: description })
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

const fetch = require('node-fetch');

exports.handler = async (event) => {
  const year = new Date().getFullYear();
  const token = process.env.INVERTEXTO_API_KEY;

  const { lat, lon } = event.queryStringParameters || {};

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
    // 1. Obter cidade e estado via geocodificação reversa
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=pt`);
    const geoData = await geoRes.json();

    const city = geoData.address.city || geoData.address.town || geoData.address.village;
    const state = geoData.address.state_code || geoData.address.state;

    if (!city || !state) {
      throw new Error('Não foi possível determinar cidade ou estado a partir da localização.');
    }

    // 2. Buscar feriados com base em cidade e estado
    const holidayUrl = `https://api.invertexto.com/v1/holidays/${year}?token=${token}&state=${state}&city=${city}`;
    const holidayRes = await fetch(holidayUrl);

    if (!holidayRes.ok) throw new Error('Erro ao buscar feriados');

    const holidays = await holidayRes.json();

    // 3. Filtrar o próximo feriado
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

    // 4. Formatar o nível do feriado
    let nivelFormatado = '';
    switch (upcoming.level) {
      case 'facultativo':
        nivelFormatado = 'facultativo';
        break;
      case 'municipal':
        nivelFormatado = 'municipal';
        break;
      case 'estadual':
        nivelFormatado = 'estadual';
        break;
      case 'nacional':
        nivelFormatado = 'nacional';
        break;
      default:
        nivelFormatado = 'feriado';
    }

    const description = `📅Feriado ${nivelFormatado}: ${upcoming.name}.  ${dateStr} ${weekday}.`;


    return {
      statusCode: 200,
      body: JSON.stringify({ message: description })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: true, message: `Erro ao buscar feriados: ${err.message}` })
    };
  }
};

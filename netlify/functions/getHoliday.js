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
    // 🌍 Busca cidade e estado via OpenStreetMap
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=pt`);
    const geoData = await geoRes.json();
    const city = geoData.address.city || geoData.address.town || geoData.address.village;
    const state = geoData.address.state_code || geoData.address.state;

    if (!city || !state) throw new Error('Cidade ou estado não encontrados.');

    // 📅 Busca feriados da cidade
    const holidayUrl = `https://api.invertexto.com/v1/holidays/${year}?token=${token}&state=${state}&city=${city}`;
    const holidayRes = await fetch(holidayUrl);
    if (!holidayRes.ok) throw new Error(`Erro HTTP: ${holidayRes.status} - ${await holidayRes.text()}`);

    const holidays = await holidayRes.json();
    const today = new Date();

    const parseDate = (str) => {
      const [y, m, d] = str.split('-').map(Number);
      return new Date(y, m - 1, d);
    };

    // 🔮 Filtra feriados futuros e ignora comemorativos
    const futureHolidays = holidays
      .map(h => ({ ...h, dateObj: parseDate(h.date) }))
      .filter(h => h.dateObj >= today && h.level !== 'comemorativo');

    // 🔁 Busca o próximo mês com feriados válidos
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
        body: JSON.stringify({ message: '🗓 Nenhum feriado futuro encontrado até o final do ano.' })
      };
    }

    // 🏷️ Formata feriados encontrados
    const formatHoliday = (h) => {
      const dateStr = h.dateObj.toLocaleDateString('pt-BR');
      const weekday = h.dateObj.toLocaleDateString('pt-BR', { weekday: 'long' });
      const tipo = {
        facultativo: 'Ponto facultativo:',
        municipal: 'Feriado municipal:',
        estadual: 'Feriado estadual:',
        nacional: 'Feriado nacional:'
      }[h.level] || 'Feriado:';
      return `🗓${tipo} ${dateStr} (${weekday}) ${h.name}`;
    };

    const message = selected.map(formatHoliday).join('\n');

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

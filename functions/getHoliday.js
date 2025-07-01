const fetch = require('node-fetch');

exports.handler = async () => {
  const year = new Date().getFullYear();
  const url = `https://brasilapi.com.br/api/feriados/v1/${year}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Erro ao buscar feriados');

    const data = await res.json();

    const holidays = data.map(h => ({
      name: h.name,
      date: h.date,
      type: 'feriado nacional'
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(holidays)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao buscar feriados' })
    };
  }
};

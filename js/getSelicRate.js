const fetch = require('node-fetch');

exports.handler = async () => {
  try {
    const res = await fetch('https://brasilapi.com.br/api/taxas/v1/selic');
    const data = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ selic: parseFloat(data.valor) })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao obter taxa SELIC.' })
    };
  }
};

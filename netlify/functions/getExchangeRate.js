const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { currency } = event.queryStringParameters;
  const apiKey = process.env.EXCHANGE_RATE_API_KEY;
  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${currency}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.result !== "success") {
      throw new Error(`Erro da API: ${data['error-type'] || 'desconhecido'}`);
    }

    const brlRate = data.conversion_rates?.BRL;

    if (!brlRate) {
      throw new Error(`Taxa de conversão para BRL não encontrada para ${currency}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ brl: brlRate })
    };
  } catch (error) {
    console.error(`Erro ao buscar cotação de ${currency}:`, error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Erro ao obter cotação de ${currency}` })
    };
  }
};

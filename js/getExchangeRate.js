const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { currency } = event.queryStringParameters;
  const apiKey = process.env.EXCHANGE_RATE_API_KEY;
  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${currency}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const brlRate = data.conversion_rates?.BRL;

    return {
      statusCode: 200,
      body: JSON.stringify({ brl: brlRate })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Erro ao obter cotação de ${currency}` })
    };
  }
};

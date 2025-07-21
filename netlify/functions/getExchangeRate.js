const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { currency } = event.queryStringParameters || {};

  if (!currency) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: true, message: 'Parâmetro "currency" é obrigatório.' })
    };
  }

  try {
    const url = `https://api.frankfurter.app/latest?from=${currency.toUpperCase()}&to=BRL`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || !data.rates?.BRL) {
      throw new Error(`Falha ao obter taxa BRL para ${currency.toUpperCase()}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ brl: data.rates.BRL })
    };

  } catch (error) {
    console.error(`Erro ao buscar cotação de ${currency}:`, error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: true,
        message: `Erro ao obter cotação de ${currency.toUpperCase()}`,
        detalhe: error.message
      })
    };
  }
};

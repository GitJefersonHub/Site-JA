const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { currency } = event.queryStringParameters || {};
  const apiKey = process.env.EXCHANGE_RATE_API_KEY;

  // 🧾 Validação de parâmetros
  if (!currency) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: true,
        message: 'Parâmetro "currency" é obrigatório.'
      })
    };
  }

  // 🔐 Verificação da chave da API
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: true,
        message: 'Chave da API de câmbio não configurada.'
      })
    };
  }

  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${currency.toUpperCase()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro HTTP da API: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (data.result !== 'success') {
      throw new Error(`Erro da API: ${data['error-type'] || 'desconhecido'}`);
    }

    const brlRate = data.conversion_rates?.BRL;

    if (typeof brlRate !== 'number') {
      throw new Error(`Taxa de conversão para BRL não encontrada ou inválida para ${currency.toUpperCase()}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ brl: brlRate })
    };
  } catch (error) {
    console.error(`Erro ao buscar cotação de ${currency}:`, error);
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

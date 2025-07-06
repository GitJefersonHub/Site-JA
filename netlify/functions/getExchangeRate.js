const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { currency } = event.queryStringParameters || {};
  const apiKey = process.env.EXCHANGE_RATE_API_KEY;

  // ❌ Falta o parâmetro "currency"
  if (!currency) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: true, message: 'Parâmetro "currency" é obrigatório.' })
    };
  }

  // ❌ Chave da API não configurada
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: true, message: 'Chave da API de câmbio não configurada.' })
    };
  }

  // 🔗 Monta URL da API
  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${currency.toUpperCase()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status} - ${await response.text()}`);

    const data = await response.json();
    if (data.result !== 'success') throw new Error(`Erro da API: ${data['error-type'] || 'desconhecido'}`);

    const brlRate = data.conversion_rates?.BRL;
    if (typeof brlRate !== 'number') throw new Error(`Taxa BRL inválida para ${currency.toUpperCase()}`);

    // ✅ Sucesso: retorna taxa BRL
    return {
      statusCode: 200,
      body: JSON.stringify({ brl: brlRate })
    };

  } catch (error) {
    // ⚠️ Erro na requisição ou resposta
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

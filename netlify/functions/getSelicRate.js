const fetch = require('node-fetch');

exports.handler = async () => {
  try {
    const res = await fetch('https://brasilapi.com.br/api/taxas/v1/selic');
    const data = await res.json();

    if (!data || !data.valor) {
      throw new Error("Resposta inválida da API SELIC.");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ selic: parseFloat(data.valor) })
    };
  } catch (error) {
    console.error("Erro ao buscar SELIC:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao obter taxa SELIC.' })
    };
  }
};

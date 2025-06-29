const fetch = require('node-fetch');

exports.handler = async () => {
  try {
    const res = await fetch('https://brasilapi.com.br/api/taxas/v1/selic');

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Erro HTTP da API SELIC: ${res.status} - ${errorText}`);
    }

    const data = await res.json();

    console.log("Resposta bruta da API SELIC:", JSON.stringify(data, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ dadosRecebidos: data })
    };
  } catch (error) {
    console.error("Erro ao buscar SELIC:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: true,
        message: 'Erro ao obter taxa SELIC.',
        detalhe: error.message
      })
    };
  }
};

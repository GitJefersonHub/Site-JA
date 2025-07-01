const fetch = require('node-fetch');

exports.handler = async () => {
  try {
    const res = await fetch('https://brasilapi.com.br/api/taxas/v1');

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Erro HTTP da API SELIC: ${res.status} - ${errorText}`);
    }

    const data = await res.json();

    const selic = data.find(taxa => taxa.nome === 'Selic');

    if (!selic || typeof selic.valor !== 'number') {
      throw new Error('Taxa Selic não encontrada ou inválida.');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ selic: selic.valor })
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

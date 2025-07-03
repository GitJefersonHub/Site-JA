const fetch = require('node-fetch');

exports.handler = async () => {
  try {
    const response = await fetch('https://brasilapi.com.br/api/taxas/v1');

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro HTTP da API SELIC: ${response.status} - ${errorText}`);
    }

    const taxas = await response.json();

    const selic = taxas.find(taxa =>
      taxa.nome?.toLowerCase() === 'selic' && typeof taxa.valor === 'number'
    );

    if (!selic) {
      throw new Error('Taxa Selic não encontrada ou inválida.');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ selic: selic.valor })
    };
  } catch (error) {
    console.error('Erro ao buscar SELIC:', error);
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

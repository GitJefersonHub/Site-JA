// Obter taxa selic
const fetch = require('node-fetch');

// 🧠 Cache em memória
let cachedSelic = null;
let cacheTimestamp = null;
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hora

exports.handler = async () => {
  const now = Date.now();

  // ✅ Retorna do cache se ainda estiver válido
  if (cachedSelic && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION_MS)) {
    return {
      statusCode: 200,
      body: JSON.stringify({ selic: cachedSelic })
    };
  }

  try {
    // 📡 Requisição à API
    const response = await fetch('https://brasilapi.com.br/api/taxas/v1');
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status} - ${await response.text()}`);

    const taxas = await response.json();

    // 🔍 Busca pela taxa SELIC
    const selic = taxas.find(t =>
      t.nome?.toLowerCase() === 'selic' && typeof t.valor === 'number'
    );

    if (!selic) throw new Error('Taxa SELIC não encontrada ou inválida.');

    // 💾 Atualiza cache
    cachedSelic = selic.valor;
    cacheTimestamp = now;

    return {
      statusCode: 200,
      body: JSON.stringify({ selic: cachedSelic })
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

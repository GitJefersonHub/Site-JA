const Redis = require('ioredis');

// 🔐 Conecta ao Redis usando a variável de ambiente
const redis = new Redis(process.env.REDIS_URL);

exports.handler = async () => {
  try {
    // 🧪 Testa conexão com Redis
    await redis.set('diagnostic:test', 'ok', 'EX', 10); // TTL de 10 segundos
    const value = await redis.get('diagnostic:test');

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Conexão com Redis bem-sucedida!',
        valorLido: value
      })
    };
  } catch (error) {
    // ⚠️ Retorna erro se falhar
    console.error('Erro ao conectar ao Redis:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'Falha ao conectar ao Redis.',
        erro: error.message
      })
    };
  }
};

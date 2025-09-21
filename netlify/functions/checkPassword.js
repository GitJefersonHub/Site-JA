exports.handler = async (event) => {
  const { senha, tipo } = JSON.parse(event.body || '{}');

  const senhaSFV = process.env.SFV_PASSWORD;
  const senhaSamurai = process.env.SAMURAI_PASSWORD;

  let autorizado = false;

  if (tipo === 'sfv' && senha === senhaSFV) {
    autorizado = true;
  } else if (tipo === 'samurai' && senha === senhaSamurai) {
    autorizado = true;
  }

  return {
    statusCode: autorizado ? 200 : 403,
    body: JSON.stringify({ autorizado })
  };
};

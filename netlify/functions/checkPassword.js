exports.handler = async (event) => {
  const { senha } = JSON.parse(event.body || '{}');
  const senhaCorreta = process.env.SFV_PASSWORD;

  if (senha === senhaCorreta) {
    return {
      statusCode: 200,
      body: JSON.stringify({ autorizado: true })
    };
  }

  return {
    statusCode: 403,
    body: JSON.stringify({ autorizado: false })
  };
};

// obter endereço
const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { lat, lon } = event.queryStringParameters || {};
  const apiKey = process.env.DISTANCEMATRIX_KEY;

  if (!lat || !lon) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: true, message: 'Latitude e longitude são obrigatórios.' })
    };
  }

  const url = `https://api.distancematrix.ai/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}&language=pt-BR`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
    const data = await res.json();

    const resultado = data.result?.[0]; // Corrigido: "result" sem "s"
    const componentes = resultado?.address_components || [];

    const rua = componentes.find(c => c.types.includes('route'))?.long_name;
    const numero = componentes.find(c => c.types.includes('street_number'))?.long_name;
    const bairro = componentes.find(c => c.types.includes('sublocality') || c.types.includes('neighborhood'))?.long_name;
    const cidade = componentes.find(c => c.types.includes('locality'))?.long_name;
    const estado = componentes.find(c => c.types.includes('state'))?.short_name;
    const pais = componentes.find(c => c.types.includes('country'))?.long_name;

    let endereco = '';
    if (rua) endereco += rua;
    if (numero) endereco += `, ${numero}`;
    if (bairro) endereco += ` - ${bairro}`;
    if (cidade || estado || pais) {
      endereco += `, ${[cidade, estado, pais].filter(Boolean).join(', ')}`;
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        endereco: endereco || resultado?.formatted_address || `${lat}, ${lon}`
      })
    };

  } catch (error) {
    console.error('Erro ao buscar endereço:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: true, message: error.message })
    };
  }
};

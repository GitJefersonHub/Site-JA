// funções auxiliares que não são genéricas o suficiente para utils.js
export function getUmidadeIcon(nivel) {
  return {
    Baixa: '🔥',
    Boa: '💧',
    Alta: '🌊'
  }[nivel] || '💧';
}

export async function getEnderecoCompleto(latitude, longitude) {
  try {
    const res = await fetch(`/.netlify/functions/getAddress?lat=${latitude}&lon=${longitude}`);
    if (!res.ok) throw new Error('Erro ao buscar endereço');
    const data = await res.json();
    return data.endereco || 'Endereço não disponível';
  } catch (error) {
    console.error('Erro ao buscar endereço:', error);
    return 'Endereço não disponível';
  }
}

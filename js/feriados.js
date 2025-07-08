// Função que busca o próximo feriado com base na latitude e longitude
export async function getNextHoliday(lat, lon) {
  try {
    // Faz requisição à função serverless que retorna o feriado
    const res = await fetch(`/.netlify/functions/getHoliday?lat=${lat}&lon=${lon}`);
    
    // Se a resposta for inválida, lança erro
    if (!res.ok) throw new Error();

    // Converte a resposta em JSON
    const data = await res.json();

    // Retorna a mensagem do feriado ou uma mensagem padrão
    return data.message || '🗓 Feriado indisponível.';
  } catch {
    // Em caso de erro, retorna mensagem padrão
    return '🗓 Feriado indisponível.';
  }
}

// Função que busca os próximos feriados com base na latitude e longitude
export async function getNextHoliday(lat, lon) {
  try {
    const res = await fetch(`/.netlify/functions/getHoliday?lat=${lat}&lon=${lon}`);
    
    if (!res.ok) throw new Error();

    const data = await res.json();

    // Verifica se data.holidays é um array válido
    if (Array.isArray(data.holidays)) {
      return data.holidays;
    }

    // Se não houver feriados válidos, retorna array vazio
    return [];
  } catch {
    // Em caso de erro, retorna array vazio
    return [];
  }
}

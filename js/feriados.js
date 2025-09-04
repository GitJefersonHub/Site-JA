// Função que busca os próximos feriados com base na latitude e longitude
export async function getNextHoliday(lat, lon) {
  try {
    const url = `/.netlify/functions/getHoliday?lat=${lat}&lon=${lon}`;
    const res = await fetch(url);

    if (!res.ok) {
      console.warn(`Erro ao buscar feriados: ${res.status}`);
      return [];
    }

    const { holidays } = await res.json();

    return Array.isArray(holidays) ? holidays : [];
  } catch (err) {
    console.error('Erro na função getNextHoliday:', err);
    return [];
  }
}

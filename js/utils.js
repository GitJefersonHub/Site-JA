// Representa sensações térmicas com emoji
export function getTemperatureFeelingIcon(temp) {
  const t = parseFloat(temp);
  if (t <= 10) return '🥶';         
  if (t <= 18) return '🧥';         
  if (t <= 27) return '🙂';         
  if (t <= 33) return '🥵';         
  return '🔥';                      
}

// Classifica índice UV com emoji e descrição
export function getUvIndexDescription(uv) {
  const uvValue = parseFloat(uv);
  if (isNaN(uvValue)) return '🔍 Índice UV indisponível';

  if (uvValue < 3) return '🟢 Baixo';
  if (uvValue < 6) return '🟡 Moderado';
  if (uvValue < 8) return '🟠 Alto';
  if (uvValue < 11) return '🔴 Muito alto';
  return '🟣 Extremo';
}

// Representa condições climáticas com ícones
export function getWeatherIcon(description) {
  const desc = description.toLowerCase();

  if (desc.includes('céu limpo')) return '☀️';
  if (desc.includes('nublado') && !desc.includes('parcial')) return '☁️';
  if (desc.includes('algumas nuvens') || desc.includes('parcial')) return '⛅';
  if (desc.includes('chuva leve')) return '🌦️';
  if (desc.includes('chuva') || desc.includes('tempestade')) return '🌧️';
  if (desc.includes('neve')) return '❄️';
  if (desc.includes('névoa') || desc.includes('neblina')) return '🌫️';

  return '🌡️';
}

// Formata número para dois dígitos
export const formatTwoDigits = value => 
  parseInt(value).toString().padStart(2, '0');

// Busca índice UV atual com base em lat/lon
export async function fetchCurrentUvIndex(lat, lon) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=uv_index`;
    const response = await fetch(url);
    const data = await response.json();

    const uv = data?.current?.uv_index;
    if (!Number.isFinite(uv)) throw new Error('Índice UV inválido ou ausente.');

    return uv;
  } catch (error) {
    console.error('Erro ao buscar índice UV:', error.message);
    return null;
  }
}

export function getTemperatureFeelingIcon(temp) {
  const t = parseFloat(temp);
  if (t <= 10) return '🥶';
  if (t <= 18) return '🧥';
  if (t <= 27) return '🙂';
  if (t <= 33) return '🥵';
  return '🔥';
}

export function getUvIndexDescription(uv) {
  const uvValue = parseFloat(uv);
  if (isNaN(uvValue)) return '🔍 Índice UV indisponível';

  if (uvValue < 3) return '🟢 Baixo';
  if (uvValue < 6) return '🟡 Moderado';
  if (uvValue < 8) return '🟠 Alto';
  if (uvValue < 11) return '🔴 Muito alto';
  return '🟣 Extremo';
}

export function getWeatherCodeIcon(code) {
  const icons = {
    0: '☀️ Céu limpo',
    1: '⛅ Parcialmente nublado',
    2: '☁️ Nublado',
    3: '🌫️ Névoa',
    45: '🌫️ Névoa com bancos densos',
    48: '🌫️ Névoa depositada (como neblina congelada)',
    51: '🌦️ Chuvisco leve',
    61: '🌧️ Chuva fraca',
    63: '🌧️ Chuva moderada',
    65: '🌧️ Chuva intensa',
    80: '⛈️ Pancadas de chuva',
    95: '🌩️ Tempestade'
  };
  return icons[code] || '🌡️ Condição indefinida';
}

export const formatTwoDigits = value =>
  parseInt(value).toString().padStart(2, '0');

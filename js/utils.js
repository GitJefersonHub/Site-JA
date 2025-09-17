// 🍃 Ícone térmico baseado na temperatura
export function getTemperatureFeelingIcon(temp) {
  const t = parseFloat(temp);
  if (t <= 10) return '🥶';       // Muito frio
  if (t <= 18) return '🧥';       // Frio
  if (t <= 29) return '🙂';       // Agradável
  if (t <= 33) return '🥵';       // Calor
  return '🔥';                    // Muito quente
}

// 🌞 Descrição do índice UV
export function getUvIndexDescription(uv) {
  const uvValue = parseFloat(uv);
  if (isNaN(uvValue)) return '🔍 Índice UV indisponível';

  if (uvValue < 3) return '🟢 Baixo';
  if (uvValue < 6) return '🟡 Moderado';
  if (uvValue < 8) return '🟠 Alto';
  if (uvValue < 11) return '🔴 Muito alto';
  return '🟣 Extremo';
}

// 🌍 Descrições multilíngue por categoria
const i18nLabels = {
  pt: {
    clear: 'Céu limpo',
    partlyCloudy: 'Parc nublado',
    cloudy: 'Nublado',
    foggy: 'Névoa',
    drizzle: 'Chuvisco',
    rain: 'Chuva',
    storm: 'Tempestade',
    unknown: 'Condição indefinida'
  },
  en: {
    clear: 'Clear sky',
    partlyCloudy: 'Partly cloudy',
    cloudy: 'Cloudy',
    foggy: 'Fog',
    drizzle: 'Light drizzle',
    rain: 'Rain',
    storm: 'Storm',
    unknown: 'Unknown condition'
  }
};

// 🌤️ Categorias e ícones climáticos
const weatherCategories = {
  clear: { codes: [0], day: '☀️', night: '🌙' },
  partlyCloudy: { codes: [1], day: '⛅', night: '🌤️' },
  cloudy: { codes: [2], day: '☁️', night: '☁️' },
  foggy: { codes: [3, 45, 48], day: '🌫️', night: '🌫️' },
  drizzle: { codes: [51], day: '🌦️', night: '🌧️' },
  rain: { codes: [61, 63, 65], day: '🌧️', night: '🌧️' },
  storm: { codes: [80, 95], day: '⛈️', night: '🌩️' }
};

// 🧠 Função principal com contexto e idioma
export function getWeatherCodeIcon(code, options = {}) {
  const { temperatura, uv, lang = 'pt' } = options;
  const hour = new Date().getHours();
  const isNight = hour < 6 || hour > 18;

  for (const categoria in weatherCategories) {
    const { codes, day, night } = weatherCategories[categoria];
    if (codes.includes(code)) {
      const label = i18nLabels[lang]?.[categoria] || categoria;

      // Correção visual para código parcialmente nublado
      if (
        categoria === 'partlyCloudy' &&
        temperatura > 23 &&
        uv < 4 &&
        !isNight
      ) {
        return `${weatherCategories.clear.day} ${i18nLabels[lang].clear}`; // poucas nuvens
      }

      const icon = isNight ? night : day;
      return `${icon} ${label}`;
    }
  }

  return `🌡️ ${i18nLabels[lang]?.unknown || 'Condição indefinida'}`;
}

// 🧮 Função para garantir dois dígitos
export const formatTwoDigits = value =>
  parseInt(value).toString().padStart(2, '0');

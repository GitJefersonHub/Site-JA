// Retorna um emoji representando o clima com base na descrição textual
export function getTemperatureFeelingIcon(temp) {
  const t = parseFloat(temp);
  if (t <= 10) return '🥶';         // Muito frio
  if (t <= 18) return '🧥';         // Frio
  if (t <= 26) return '🙂';         // Agradável
  if (t <= 33) return '🥵';         // Quente
  return '🔥';                      // Muito quente
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

export function getWeatherIcon(description) {
  const desc = description.toLowerCase(); // Converte para minúsculas para facilitar a comparação

  if (desc.includes('céu limpo')) return'☀️';              // Sol
  if (desc.includes('nublado') && !desc.includes('parcial')) return'☁️'; // Nublado total
  if (desc.includes('algumas nuvens') || desc.includes('parcial')) return'⛅'; // Parcialmente nublado
  if (desc.includes('chuva leve')) return'🌦️';             // Chuva leve
  if (desc.includes('chuva') || desc.includes('tempestade')) return'🌧️'; // Chuva forte ou tempestade
  if (desc.includes('neve')) return'❄️';                   // Neve
  if (desc.includes('névoa') || desc.includes('neblina')) return'🌫️'; // Névoa ou neblina

  return'🌡️'; // Ícone padrão para condições não reconhecidas
}

// Formata um número para ter sempre dois dígitos (ex: 7 → "07")
export const formatTwoDigits = value => 
  parseInt(value).toString().padStart(2, '0');

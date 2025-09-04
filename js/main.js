// Responsável por iniciar o processo quando a página carrega.
import { getWeather } from './weather.js';

navigator.geolocation.getCurrentPosition(pos => {
  const { latitude, longitude } = pos.coords;
  getWeather(latitude, longitude);
}, err => {
  console.error('Erro ao obter localização:', err);
  document.getElementById('weather').innerHTML = 'Não foi possível obter sua localização.';
});

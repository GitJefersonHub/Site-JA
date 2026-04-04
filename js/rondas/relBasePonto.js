const listaPonto = JSON.parse(localStorage.getItem('Ponto')) || [];
const dadosUsuario = JSON.parse(localStorage.getItem('dadosUsuario')) || {};

function obterMesAnoAtual() {
  const meses = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];
  const agora = new Date();
  return `${meses[agora.getMonth()]}-${agora.getFullYear()}`;
}

function formatarDataHoraSeparado(dataStr) {
  const [data, hora] = dataStr.split(' ');
  const [dia, mes] = data.split('/');
  const [h, m] = hora.split(':');
  return { data: `${dia}/${mes}`, hora: `${h}:${m}` };
}

// Lista de resumos armazenados
const listaResumo = JSON.parse(localStorage.getItem('Resumo')) || [];

const listaPonto = JSON.parse(localStorage.getItem('Ponto')) || [];
const dadosUsuario = JSON.parse(localStorage.getItem('dadosUsuario')) || {};
const listaResumo = JSON.parse(localStorage.getItem('Resumo')) || [];

// Função para obter mês/ano atual (sem dia da semana)
function obterMesAnoAtual() {
  const meses = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];

  const agora = new Date();
  const mes = meses[agora.getMonth()];
  const ano = agora.getFullYear();

  return `${mes}-${ano}`;
}

// Função para formatar data/hora no modelo brasileiro dd/mm abrevDiaSemana
function formatarDataHoraSeparado(dataHoraStr) {
  const dataObj = dataHoraStr ? new Date(dataHoraStr) : new Date();

  if (isNaN(dataObj.getTime())) {
    return { data: 'Data inválida', hora: 'Hora inválida' };
  }

  const diasSemana = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

  const dia = String(dataObj.getDate()).padStart(2, '0');
  const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
  const diaSemana = diasSemana[dataObj.getDay()];
  const hora = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return { data: `${dia}/${mes} ${diaSemana}`, hora };
}

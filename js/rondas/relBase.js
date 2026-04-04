// Funções utilitárias para relatórios

/**
 * Retorna o mês e ano atual em formato "março-2026"
 */
function obterMesAnoAtual() {
  const data = new Date();
  const mes = data.toLocaleString('pt-BR', { month: 'long' });
  const ano = data.getFullYear();
  return `${mes}-${ano}`;
}

/**
 * Recebe uma string de data/hora e retorna objeto { data, hora }
 * Exemplo: "2026-03-29T17:15:00" -> { data: "29/03/2026", hora: "17:15" }
 */
function formatarDataHoraSeparado(dataHoraStr) {
  if (!dataHoraStr) {
    return { data: '---', hora: '---' };
  }

  const dataObj = new Date(dataHoraStr);

  // Proteção contra datas inválidas
  if (isNaN(dataObj.getTime())) {
    return { data: 'Data inválida', hora: 'Hora inválida' };
  }

  const data = dataObj.toLocaleDateString('pt-BR');
  const hora = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return { data, hora };
}

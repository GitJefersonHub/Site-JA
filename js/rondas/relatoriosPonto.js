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

function criarTabelaPonto() {
  const container = document.getElementById('tabelaPonto');
  container.innerHTML = '';

  const h2 = document.createElement('h2');
  h2.textContent = `📋 Registros de Bastão - ${obterMesAnoAtual()}`;
  container.appendChild(h2);

  const wrapper = document.createElement('div');
  wrapper.className = 'table-wrapper';

  if (listaPonto.length === 0) {
    wrapper.innerHTML = `<p>Nenhum registro de Ponto encontrado.</p>`;
  } else {
    // Tabela de login (fixa)
    const tableLogin = document.createElement('table');
    tableLogin.innerHTML = `
      <thead>
        <tr>
          <th>Nome</th>
          <th>Matrícula</th>
          <th>Local</th>
          <th>Posto</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${dadosUsuario.nome || '---'}</td>
          <td>${dadosUsuario.matricula || '---'}</td>
          <td>${dadosUsuario.localizacao || 'Não informado'}</td>
          <td>${dadosUsuario.posto || '---'}</td>
        </tr>
      </tbody>
    `;

    // Tabela de registros (linhas variáveis)
    const tableRegistro = document.createElement('table');
    tableRegistro.innerHTML = `
      <thead>
        <tr>
          <th>Data</th>
          <th>Horas</th>
          <th>Ambiente</th>
          <th>Observação</th>
          <th>Localização</th>
        </tr>
      </thead>
      <tbody id="tbodyRegistro"></tbody>
    `;

    const tbodyRegistro = tableRegistro.querySelector('#tbodyRegistro');

    listaPonto.forEach(item => {
      const { data, hora } = formatarDataHoraSeparado(item.dataHora || item.registro);

      let localizacaoHtml = item.localizacao || 'Não encontrada';
      if (item.localizacao && item.localizacao !== 'Não encontrada') {
        localizacaoHtml = `<a href="https://www.google.com/maps/search/?api=1&query=${item.localizacao}" target="_blank">${item.localizacao}</a>`;
      }

      const linhaRegistro = document.createElement('tr');
      linhaRegistro.innerHTML = `
        <td>${data}</td>
        <td>${hora}</td>
        <td>${item.registro || 'Não informado'}</td>
        <td>${item.obs || 'Sem observação'}</td>
        <td>${localizacaoHtml}</td>
      `;
      tbodyRegistro.appendChild(linhaRegistro);
    });

    wrapper.appendChild(tableLogin);
    wrapper.appendChild(tableRegistro);
  }

  container.appendChild(wrapper);

}

function imprimirPonto() {
  // Carrega os resumos também
  const listaResumo = JSON.parse(localStorage.getItem('Resumo')) || [];

  if (listaPonto.length === 0 && listaResumo.length === 0) {
    alert('Nenhum ponto ou resumo registrado.');
    return;
  }

  criarJanelaImpressao('Jornada', listaPonto, listaResumo);
}

function excluirPonto() {
  if (confirm('Tem certeza que deseja excluir todos os registros?')) {
    // Remove registros de ponto
    localStorage.removeItem('Ponto');
    listaPonto.length = 0;
    criarTabelaPonto();

    // Remove registros de resumo
    localStorage.removeItem('Resumo');
    listaResumo.length = 0;
    criarTabelaResumo();

    alert('Registros excluídos com sucesso!');
  }
}

function criarJanelaImpressao(tipo, listaPonto, listaResumo) {
  let content = `
    <h2>📋 Registros de ${tipo} - ${obterMesAnoAtual()}</h2>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Matrícula</th>
            <th>Local</th>
            <th>Posto</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${dadosUsuario.nome || '---'}</td>
            <td>${dadosUsuario.matricula || '---'}</td>
            <td>${dadosUsuario.localizacao || 'Não informado'}</td>
            <td>${dadosUsuario.posto || '---'}</td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Horas</th>
            <th>Ambiente</th>
            <th>Observação</th>
            <th>Localização</th>
          </tr>
        </thead>
        <tbody>
  `;

  // Registros de ponto
  listaPonto.forEach(item => {
    const { data, hora } = formatarDataHoraSeparado(item.dataHora || item.registro);

    let localizacaoHtml = item.localizacao || 'Não encontrada';
    if (item.localizacao && item.localizacao !== 'Não encontrada') {
      localizacaoHtml = `<a href="https://www.google.com/maps/search/?api=1&query=${item.localizacao}" target="_blank">${item.localizacao}</a>`;
    }

    content += `
      <tr>
        <td>${data}</td>
        <td>${hora}</td>
        <td>${item.registro || 'Não informado'}</td>
        <td>${item.obs || 'Sem observação'}</td>
        <td>${localizacaoHtml}</td>
      </tr>
    `;
  });

  content += `
        </tbody>
      </table>
  `;

  // ✅ Inserindo a tabela de Resumo
  if (listaResumo.length > 0) {
    content += `
      <table>
        <thead>
          <tr>
            <th>Resumo</th>
          </tr>
        </thead>
        <tbody>
    `;

    listaResumo.forEach(item => {
      content += `
        <tr>
          <td>${item.resumo}</td>
        </tr>
      `;
    });

    content += `
        </tbody>
      </table>
    `;
  }

  content += `</div>`;

  const win = window.open('', '', 'width=900,height=600');
  win.document.write(`
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Registros de bastão e resumos</title>
        <link rel="stylesheet" href="css/relatorios.css">
      </head>
      <body>${content}</body>
    </html>
  `);
  win.document.close();
  win.onload = () => {
    win.focus();
    win.print();
  };
}

criarTabelaPonto();

// Lista de resumos armazenados
const listaResumo = JSON.parse(localStorage.getItem('Resumo')) || [];

// Abrir modal de resumo
function registrarResumo() {
  document.getElementById('campoResumo').value = '';
  document.getElementById('contadorResumo').textContent = '2000 restantes';
  document.getElementById('modalResumo').style.display = 'flex';
}

// Confirmar resumo
function confirmarResumo() {
  const campo = document.getElementById('campoResumo');
  const resumoTexto = (campo?.value || '').trim();

  if (!resumoTexto) {
    alert('Por favor, insira um resumo da jornada.');
    campo?.focus();
    return;
  }

  const agora = new Date();
  const dataHora = agora.toLocaleString('pt-BR');

  const registroResumo = {
    dataHora,
    resumo: resumoTexto
  };

  listaResumo.push(registroResumo);
  localStorage.setItem('Resumo', JSON.stringify(listaResumo));

  alert('Resumo registrado com sucesso!');
  document.getElementById('modalResumo').style.display = 'none';

  criarTabelaResumo();
}

// Cancelar resumo
function cancelarResumo() {
  document.getElementById('modalResumo').style.display = 'none';
}

// Atualizar contador de caracteres
document.addEventListener('DOMContentLoaded', () => {
  const campoResumo = document.getElementById('campoResumo');
  if (campoResumo) {
    campoResumo.addEventListener('input', () => {
      const restante = 2000 - campoResumo.value.length;
      document.getElementById('contadorResumo').textContent = `${restante} restantes`;
    });
  }
  criarTabelaResumo(); // Renderiza tabela ao carregar
});

function criarTabelaResumo() { 
  const tabelaResumo = document.getElementById("tabelaResumo");
  tabelaResumo.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'table-wrapper';


  if (listaResumo.length === 0) {
    wrapper.innerHTML = `<p>Nenhum registro de Resumo encontrado.</p>`;
  } else {
    const table = document.createElement('table');
    table.innerHTML = `
      <thead>
        <tr>
          <th>Resumo</th>
        </tr>
      </thead>
      <tbody id="tbodyResumo"></tbody>
    `;

    const tbodyResumo = table.querySelector('#tbodyResumo');
    listaResumo.forEach(item => {
      const linha = document.createElement('tr');
      linha.innerHTML = `<td>${item.resumo}</td>`;
      tbodyResumo.appendChild(linha);
    });

    wrapper.appendChild(table);
  }

  // ✅ Botões posicionados logo abaixo da tabela
  const btns = document.createElement('div');
  btns.className = 'button-group';
  btns.style.marginTop = '15px';
  btns.innerHTML = `
    <button onclick="imprimirPonto()">🖨️ Imprimir Registros</button>
    <button onclick="excluirPonto()">🗑️ Excluir Registros</button>
  `;
  wrapper.appendChild(btns);

  tabelaResumo.appendChild(wrapper);
}

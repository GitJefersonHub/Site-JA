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
    // Tabela de login (fixa, com 2 linhas)
    const tableLogin = document.createElement('table');
    tableLogin.innerHTML = `
      <thead>
        <tr>
          <th>Nome</th>
          <th>Matrícula</th>
          <th>Localização</th>
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
        </tr>
      </thead>
      <tbody id="tbodyRegistro"></tbody>
    `;

    const tbodyRegistro = tableRegistro.querySelector('#tbodyRegistro');

    listaPonto.forEach(item => {
      const { data, hora } = formatarDataHoraSeparado(item.dataHora || item.registro);

      const linhaRegistro = document.createElement('tr');
      linhaRegistro.innerHTML = `
        <td>${data}</td>
        <td>${hora}</td>
        <td>${item.registro || 'Não informado'}</td>
        <td>${item.obs || 'Sem observação'}</td>
      `;
      tbodyRegistro.appendChild(linhaRegistro);
    });

    wrapper.appendChild(tableLogin);
    wrapper.appendChild(tableRegistro);
  }

  container.appendChild(wrapper);

  const btns = document.createElement('div');
  btns.className = 'button-group';
  btns.innerHTML = `
    <button onclick="imprimirPonto()">🖨️ Imprimir Registros</button>
    <button onclick="excluirPonto()">🗑️ Excluir Registros</button>
  `;
  container.appendChild(btns);
}

function imprimirPonto() {
  if (listaPonto.length === 0) {
    alert('Nenhum ponto registrado.');
    return;
  }
  criarJanelaImpressao('Jornada', listaPonto);
}

function excluirPonto() {
  if (confirm('Tem certeza que deseja excluir todos os registros?')) {
    localStorage.removeItem('Ponto');
    listaPonto.length = 0;
    criarTabelaPonto();
    alert('Registros excluídos com sucesso!');
  }
}

function criarJanelaImpressao(tipo, lista) {
  let content = `
    <h2>📋 Registros de ${tipo} - ${obterMesAnoAtual()}</h2>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Matrícula</th>
            <th>Localização</th>
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
          </tr>
        </thead>
        <tbody>
  `;

  lista.forEach(item => {
    const { data, hora } = formatarDataHoraSeparado(item.dataHora || item.registro);
    content += `
      <tr>
        <td>${data}</td>
        <td>${hora}</td>
        <td>${item.registro || 'Não informado'}</td>
        <td>${item.obs || 'Sem observação'}</td>
      </tr>
    `;
  });

  content += `
        </tbody>
      </table>
    </div>
  `;

  const win = window.open('', '', 'width=900,height=600');
  win.document.write(`
    <html>
      <head>
        <title>Registros de bastão</title>
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

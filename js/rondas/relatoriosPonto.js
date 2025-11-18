const listaPonto = JSON.parse(localStorage.getItem('Ponto')) || [];

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

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  thead.innerHTML = `
  <tr>
  <th>Nome</th>
    <th>Matríc</th>
    <th>Posto</th>
    <th>Data</th>
    <th>Horas</th>
    <th>Registros</th>
    <th>Localização</th>
    <th>Observação</th>
  </tr>
`;

  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  if (listaPonto.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8">Nenhum registro de Ponto encontrado.</td></tr>`;

  } else {
    listaPonto.forEach(item => {
      const { data, hora } = formatarDataHoraSeparado(item.dataHora || item.registro);
      const linha = document.createElement('tr');
      linha.innerHTML = `
      <td>${dadosUsuario.nome || '---'}</td>
  <td>${dadosUsuario.matricula || '---'}</td>
  <td>${dadosUsuario.posto || '---'}</td>
  <td>${data}</td>
  <td>${hora}</td>
  <td>${item.registro || 'Não informado'}</td>
  <td>${item.localizacao || 'Não informado'}</td>
  <td>${item.obs || 'Sem observação'}</td>
`;

      tbody.appendChild(linha);
    });
  }

  table.appendChild(tbody);
  wrapper.appendChild(table);
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
            <th>Matríc</th>
            <th>Posto</th>
            <th>Data</th>
            <th>Horas</th>
            <th>Registros</th>
            <th>Localização</th>
            <th>Observação</th>
          </tr>
        </thead>
        <tbody>
  `;

  content += lista.map(item => {
    const { data, hora } = formatarDataHoraSeparado(item.dataHora || item.registro);
    return `
      <tr>
      <td>${dadosUsuario.nome || '---'}</td>
        <td>${dadosUsuario.matricula || '---'}</td>
        <td>${dadosUsuario.posto || '---'}</td>
        <td>${data}</td>
        <td>${hora}</td>
        <td>${item.registro || 'Não informado'}</td>
        <td>${item.localizacao || 'Não informado'}</td>
        <td>${item.obs || 'Sem observação'}</td>
      </tr>
    `;
  }).join('');

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
        <style>
        @media print {
          body {
            margin: 0;
            padding: 0;
            font-size: 10pt;
            color: black;
            background: white;
          }

          h2 {
            text-align: center;
            font-size: 1.2rem;
            margin-bottom: 1rem;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            table-layout: auto;
          }

          th, td {
            border: 1px solid #000;
            padding: 0.1rem;
            font-size: 9pt;
            text-align: left;
          }
        }
      </style>

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

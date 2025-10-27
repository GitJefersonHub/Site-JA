const listaQRCode = JSON.parse(localStorage.getItem('QRCode')) || [];

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

function criarTabelaQRCode() {
  const container = document.getElementById('tabelaQRCode');
  container.innerHTML = '';

  const h2 = document.createElement('h2');
  h2.textContent = `📋 Registros de QR Code - ${obterMesAnoAtual()}`;
  container.appendChild(h2);

  const wrapper = document.createElement('div');
  wrapper.className = 'table-wrapper';

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Data</th>
      <th>Horas</th>
      <th>Localização</th>
      <th>Matrícula</th>
      <th>Observação</th>
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  if (listaQRCode.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5">Nenhum registro de QR Code encontrado.</td></tr>`;
  } else {
    listaQRCode.forEach(item => {
      const { data, hora } = formatarDataHoraSeparado(item.dataHora || item.registro);
      const linha = document.createElement('tr');
      linha.innerHTML = `
        <td>${data}</td>
        <td>${hora}</td>
        <td>${item.localizacao || 'Não informado'}</td>
        <td>${dadosUsuario.matricula || '---'}</td>
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
    <button onclick="imprimirQRCode()">🖨️ Imprimir QR Codes</button>
    <button onclick="excluirQRCode()">🗑️ Excluir QR Codes</button>
  `;
  container.appendChild(btns);
}

function imprimirQRCode() {
  if (listaQRCode.length === 0) {
    alert('Nenhum QR Code registrado.');
    return;
  }
  criarJanelaImpressao('QR Code', listaQRCode);
}

function excluirQRCode() {
  if (confirm('Tem certeza que deseja excluir todos os registros de QR Code?')) {
    localStorage.removeItem('QRCode');
    listaQRCode.length = 0;
    criarTabelaQRCode();
    alert('Registros de QR Code excluídos com sucesso!');
  }
}

function criarJanelaImpressao(tipo, lista) {
  let content = `
    <h2>📋 Registros de ${tipo} - ${obterMesAnoAtual()}</h2>
    <table>
      <thead>
        <tr>
          <th>Data</th>
          <th>Horas</th>
          <th>Localização</th>
          <th>Matrícula</th>
          <th>Observação</th>
        </tr>
      </thead>
      <tbody>
  `;

  content += lista.map(item => {
    const { data, hora } = formatarDataHoraSeparado(item.dataHora || item.registro);
    return `
      <tr>
        <td>${data}</td>
        <td>${hora}</td>
        <td>${item.localizacao || 'Não informado'}</td>
        <td>${dadosUsuario.matricula || '---'}</td>
        <td>${item.obs || 'Sem observação'}</td>
      </tr>
    `;
  }).join('');

  content += `
      </tbody>
    </table>
  `;

  const win = window.open('', '', 'width=900,height=600');
  win.document.write(`
    <html>
      <head>
        <title>Registros de bastão QR Code</title>
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

            .table-wrapper {
              overflow: visible;
              width: 100%;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              table-layout: auto;
              word-break: break-word;
            }

            th, td {
              border: 1px solid #000;
              padding: 0.4rem;
              font-size: 10pt;
            }

            thead {
              background-color: #e0e0e0;
            }

            tr:nth-child(even) {
              background-color: #f5f5f5;
            }
          }

        </style>
        <title>Registros de bastão</title>
        <link rel="stylesheet" href="css/relatorios.css">
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Open+Sans:wght@400;700&family=Roboto:wght@400;700&display=swap" rel="stylesheet">
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

criarTabelaQRCode();

function criarJanelaImpressao(tipo, listaPonto, listaResumo) {
  let content = `
    <h2>📋 Registros de ${tipo} - ${obterMesAnoAtual()}</h2>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Matríc</th>
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

  // ✅ Inserindo a tabela de Resumo com parágrafos indentados
  if (listaResumo.length > 0) {
    content += `
      <hr>
      <table>
        <thead>
          <tr>
            <th>Resumo</th>
          </tr>
        </thead>
        <tbody>
    `;

    listaResumo.forEach(item => {
      // Converter quebras de linha em parágrafos com indentação
      const textoFormatado = item.resumo
        .split(/\n+/)
        .map(par => `<p style="
            text-indent: 20px; 
            margin: 0 0 8px 0; 
            hyphens: auto; 
            word-break: break-word; 
            overflow-wrap: break-word;
          ">
            ${par}
          </p>`)
        .join('');

      content += `
        <tr>
          <td>${textoFormatado}</td>
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

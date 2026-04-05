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

criarTabelaPonto();

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
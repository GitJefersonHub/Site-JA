// Abrir modal de resumo
function registrarResumo() {
  document.getElementById('campoResumo').value = '';
  document.getElementById('contadorResumo').textContent = '2000 restantes';
  document.getElementById('modalResumo').style.display = 'flex';
}






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
      // ✅ Converter quebras de linha em parágrafos com indentação e hifenização
      const textoFormatado = item.resumo
        .split(/\n+/)
        .map(par => `
          <p style="
            text-indent: 20px; 
            margin: 0 0 8px 0; 
            hyphens: auto; 
            word-break: break-word; 
            overflow-wrap: break-word;
          ">
            ${par}
          </p>
        `)
        .join('');

      const linha = document.createElement('tr');
      linha.innerHTML = `
        <td>${textoFormatado}</td>
      `;
      tbodyResumo.appendChild(linha);
    });

    wrapper.appendChild(table);
  }

  // Botões abaixo da tabela
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
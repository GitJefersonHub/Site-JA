// Exibe saudação e dados do usuário logado
document.getElementById('boasVindas').textContent = gerarSaudacao(dados.nome);
document.getElementById('infoNome').textContent = `🆔 Nome: ${dados.nome}`;
document.getElementById('infoMatricula').textContent = `📌 Matrícula: ${dados.matricula}`;
document.getElementById('infoLocalizacao').textContent = `📍 Localização: ${dados.localizacao}`;
document.getElementById('infoPosto').textContent = `🏢 Posto: ${dados.posto}`;

// Função para imprimir lista de usuários
function imprimirLista() {
  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  const usuarioLogado = JSON.parse(localStorage.getItem('dadosUsuario'));

  if (usuarios.length === 0) {
    alert('Nenhum usuário cadastrado para imprimir.');
    return;
  }

  let printContent = '<h2>Usuários Cadastrados</h2><ul style="list-style:none;">';
  usuarios.forEach((user, index) => {
    const estaLogado =
      usuarioLogado &&
      user.nome === usuarioLogado.nome &&
      user.matricula === usuarioLogado.matricula &&
      user.posto === usuarioLogado.posto;

    printContent += `
      <li style="margin-bottom: 15px;">
        <strong>${index + 1}. ${user.nome}</strong> ${estaLogado ? '<span style="color: green;">(Logado)</span>' : ''}<br>
        Matrícula: ${user.matricula}<br>
        Local: ${user.localizacao}<br>
        Posto: ${user.posto}<br>
      </li>
    `;
  });
  printContent += '</ul>';

  const printWindow = window.open('', '', 'width=800,height=600');
  printWindow.document.write(`
    <html>
      <head>
        <title>Impressão da Lista</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h2 { text-align: center; }
          span { font-weight: bold; }
        </style>
      </head>
      <body>${printContent}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

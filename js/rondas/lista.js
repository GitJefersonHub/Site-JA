
// Exibe saudação e dados
document.getElementById('boasVindas').textContent = gerarSaudacao(dados.nome);
document.getElementById('infoNome').textContent = `📌 Nome: ${dados.nome}`;
document.getElementById('infoMatricula').textContent = `📌 Matrícula: ${dados.matricula}`;
document.getElementById('infoTelefone').textContent = `📞 Telefone: ${dados.telefone}`;
document.getElementById('infoEmail').textContent = `📧 E-mail: ${dados.email}`;

// Função para imprimir lista de usuários
function imprimirLista() {
  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  const usuarioLogado = JSON.parse(localStorage.getItem('dadosUsuario'));

  if (usuarios.length === 0) {
    alert('Nenhum usuário cadastrado para imprimir.');
    return;
  }

  let printContent = '<h2>Lista de Usuários</h2><ul style="list-style:none;">';
  usuarios.forEach((user, index) => {
    const dispositivoFormatado = user.dispositivo || 'Não informado';
    const estaLogado =
      usuarioLogado &&
      user.nome === usuarioLogado.nome &&
      user.matricula === usuarioLogado.matricula &&
      user.email === usuarioLogado.email;

    printContent += `
      <li style="margin-bottom: 15px;">
        <strong>${index + 1}. ${user.nome}</strong> ${estaLogado ? '<span style="color: green;">(Logado)</span>' : ''}<br>
        Matrícula: ${user.matricula}<br>
        Telefone: ${user.telefone}<br>
        E-mail: ${user.email}<br>
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

// Exibe saudação e dados
document.getElementById('boasVindas').textContent = gerarSaudacao(dados.nome);
document.getElementById('infoNome').textContent = `🆔 Nome: ${dados.nome}`;
document.getElementById('infoMatricula').textContent = `📌 Matrícula: ${dados.matricula}`;
document.getElementById('infoTelefone').textContent = `📞 Telefone: ${dados.telefone}`;
document.getElementById('infoEmail').textContent = `📧 E-mail: ${dados.email}`;

function imprimirLista() {
  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

  if (usuarios.length === 0) {
    alert('Nenhum usuário cadastrado para imprimir.');
    return;
  }

  let printContent = '<h2>Lista de Usuários</h2><ul style="list-style:none;">';
  usuarios.forEach((user, index) => {
    printContent += `
      <li style="margin-bottom: 15px;">
        <strong>${index + 1}. ${user.nome}</strong><br>
        Matrícula: ${user.matricula}<br>
        Telefone: ${user.telefone}<br>
        E-mail: ${user.email}
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
        </style>
      </head>
      <body>${printContent}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

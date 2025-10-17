if (localStorage.getItem('usuarioLogado') !== 'true') {
  window.location.href = 'login.html';
}

// Lista de usuários permitidos (pode ser expandida futuramente)
const usuariosPermitidos = [
  {
    matricula: '2815',
    telefone: '(62) 98250-2200',
    email: 'jefersonalves.ti@gmail.com',
    senha: '123456'
  },
  {
    matricula: '1020',
    telefone: '(62) 98182-2794',
    email: 'gilmacytavares@gmail.com',
    senha: '654321'
  }
];

// Recupera o usuário logado
const dados = JSON.parse(localStorage.getItem('dadosUsuario'));

// Verifica se os dados correspondem a algum usuário permitido
const usuarioValido = usuariosPermitidos.find(user =>
  user.matricula === dados?.matricula &&
  user.telefone === dados?.telefone &&
  user.email === dados?.email &&
  user.senha === dados?.senha
);

if (!usuarioValido) {
  alert('Usuário não reconhecido. Faça login novamente.');
  localStorage.removeItem('usuarioLogado');
  localStorage.removeItem('dadosUsuario');
  window.location.href = 'login.html';
}

// Exibe os dados no painel
document.getElementById('infoMatricula').textContent = `📌 Matrícula: ${usuarioValido.matricula}`;
document.getElementById('infoTelefone').textContent = `📞 Telefone: ${usuarioValido.telefone}`;
document.getElementById('infoEmail').textContent = `📧 E-mail: ${usuarioValido.email}`;

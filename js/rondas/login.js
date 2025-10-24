document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loginContainer').style.display = 'block';
  document.getElementById('cadastroContainer').style.display = 'none';
});

document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const matricula = document.getElementById('matricula').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();
  const mensagem = document.getElementById('mensagem');

  if (!nome || !matricula || !telefone || !email || !senha) {
    mensagem.textContent = 'Todos os campos são obrigatórios.';
    mensagem.style.color = 'red';
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

  const credenciaisValidas = usuarios.find(user =>
    user.nome === nome &&
    user.matricula === matricula &&
    user.telefone === telefone &&
    user.email === email &&
    user.senha === senha
  );

  if (credenciaisValidas) {
    localStorage.setItem('usuarioLogado', 'true');
    localStorage.setItem('dadosUsuario', JSON.stringify(credenciaisValidas));

    mensagem.textContent = 'Login bem-sucedido!';
    mensagem.style.color = 'green';
    setTimeout(() => {
      location.replace('rondasPainel.html');
    }, 1500);
    return;
  }

  const confirmarCadastro = confirm('Usuário não encontrado.\nDeseja cadastrar com os dados informados?');

  if (confirmarCadastro) {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('cadastroContainer').style.display = 'block';

    document.getElementById('cadNome').value = nome;
    document.getElementById('cadMatricula').value = matricula;
    document.getElementById('cadTelefone').value = telefone;
    document.getElementById('cadEmail').value = email;
    document.getElementById('cadSenha').value = senha;
  } else {
    document.getElementById('loginForm').reset();
    mensagem.textContent = '';
  }
});

document.getElementById('formCadastro').addEventListener('submit', function (e) {
  e.preventDefault();

  const nome = document.getElementById('cadNome').value.trim();
  const matricula = document.getElementById('cadMatricula').value.trim();
  const telefone = document.getElementById('cadTelefone').value.trim();
  const email = document.getElementById('cadEmail').value.trim();
  const senha = document.getElementById('cadSenha').value.trim();
  const mensagem = document.getElementById('mensagemCadastro');

  if (!nome || !matricula || !telefone || !email || !senha) {
    mensagem.textContent = 'Todos os campos são obrigatórios.';
    mensagem.style.color = 'red';
    return;
  }

  const telefoneValido = /^\(\d{2}\) \d{5}-\d{4}$/.test(telefone);
  if (!telefoneValido) {
    mensagem.textContent = 'Telefone inválido. Use o formato (99) 99999-9999.';
    mensagem.style.color = 'red';
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

  const duplicado = usuarios.find(u =>
    u.nome === nome &&
    u.matricula === matricula &&
    u.telefone === telefone &&
    u.email === email &&
    u.senha === senha
  );

  if (duplicado) {
    mensagem.textContent = 'Usuário já está cadastrado.';
    mensagem.style.color = 'red';
    return;
  }

  const novoUsuario = { nome, matricula, telefone, email, senha };
  usuarios.push(novoUsuario);
  localStorage.setItem('usuarios', JSON.stringify(usuarios));

  // Login automático após cadastro
  localStorage.setItem('usuarioLogado', 'true');
  localStorage.setItem('dadosUsuario', JSON.stringify(novoUsuario));

  mensagem.textContent = 'Cadastro realizado com sucesso! Redirecionando...';
  mensagem.style.color = 'green';

  setTimeout(() => {
    location.replace('rondasPainel.html');
  }, 1500);
});

// Botão Cancelar
function voltarParaLogin() {
  document.getElementById('cadastroContainer').style.display = 'none';
  document.getElementById('loginContainer').style.display = 'block';
  document.getElementById('formCadastro').reset();
  document.getElementById('loginForm').reset();
}

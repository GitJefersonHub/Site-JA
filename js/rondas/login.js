document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loginContainer').style.display = 'block';
  document.getElementById('cadastroContainer').style.display = 'none';
});

document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const matricula = document.getElementById('matricula').value.trim();
  const posto = document.getElementById('posto').value.trim(); // Novo campo
  const localizacao = document.getElementById('localizacao').value.trim(); // substitui telefone
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();
  const mensagem = document.getElementById('mensagem');

  if (!nome || !matricula || !posto || !localizacao || !email || !senha) {
    mensagem.textContent = 'Todos os campos são obrigatórios.';
    mensagem.style.color = 'red';
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

  const credenciaisValidas = usuarios.find(user =>
    user.nome === nome &&
    user.matricula === matricula &&
    user.posto === posto &&
    user.localizacao === localizacao &&
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
    document.getElementById('cadPosto').value = posto;
    document.getElementById('cadLocalizacao').value = localizacao;
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
  const posto = document.getElementById('cadPosto').value.trim(); // Novo campo
  const localizacao = document.getElementById('cadLocalizacao').value.trim(); // substitui telefone
  const email = document.getElementById('cadEmail').value.trim();
  const senha = document.getElementById('cadSenha').value.trim();
  const mensagem = document.getElementById('mensagemCadastro');

  if (!nome || !matricula || !posto || !localizacao || !email || !senha) {
    mensagem.textContent = 'Todos os campos são obrigatórios.';
    mensagem.style.color = 'red';
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

  const duplicado = usuarios.find(u =>
    u.nome === nome &&
    u.matricula === matricula &&
    u.posto === posto &&
    u.localizacao === localizacao &&
    u.email === email &&
    u.senha === senha
  );

  if (duplicado) {
    mensagem.textContent = 'Usuário já está cadastrado.';
    mensagem.style.color = 'red';
    return;
  }

  const novoUsuario = { nome, matricula, posto, localizacao, email, senha };
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

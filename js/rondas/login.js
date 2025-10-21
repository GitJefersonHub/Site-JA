document.addEventListener('DOMContentLoaded', () => {
  // Oculta botão e container de cadastro ao carregar
  document.getElementById('btnCadastrar').style.display = 'none';
  document.querySelector('.cadastrar-container').style.display = 'none';
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

  // Verifica se existe usuário com nome e matrícula
  const usuarioExistente = usuarios.find(user =>
    user.nome === nome && user.matricula === matricula
  );

  if (!usuarioExistente) {
    const confirmarCadastro = confirm('Usuário não encontrado.\nDeseja cadastrar com os dados informados?');

    if (confirmarCadastro) {
      // Exibe botão e container de cadastro
      document.getElementById('btnCadastrar').style.display = 'block';
      document.querySelector('.cadastrar-container').style.display = 'block';

      // Preenche o formulário de cadastro com os dados informados
      document.getElementById('cadNome').value = nome;
      document.getElementById('cadMatricula').value = matricula;
      document.getElementById('cadTelefone').value = telefone;
      document.getElementById('cadEmail').value = email;
      document.getElementById('cadSenha').value = senha;

      // Exibe o formulário de cadastro
      mostrarFormularioCadastro();
    } else {
      // Limpa os campos do login
      document.getElementById('loginForm').reset();
      mensagem.textContent = '';

      // Garante que o botão e container de cadastro permaneçam ocultos
      document.getElementById('btnCadastrar').style.display = 'none';
      document.querySelector('.cadastrar-container').style.display = 'none';
    }

    return;
  }

  // Verifica credenciais completas
  const credenciaisValidas = usuarios.find(user =>
    user.nome === nome &&
    user.matricula === matricula &&
    user.telefone === telefone &&
    user.email === email &&
    user.senha === senha
  );

  if (!credenciaisValidas) {
    mensagem.textContent = 'Credenciais inválidas.';
    mensagem.style.color = 'red';
    return;
  }

  // Login bem-sucedido
  localStorage.setItem('usuarioLogado', 'true');
  localStorage.setItem('dadosUsuario', JSON.stringify(credenciaisValidas));

  mensagem.textContent = 'Login bem-sucedido!';
  mensagem.style.color = 'green';
  setTimeout(() => {
    location.replace('rondasPainel.html');
  }, 1500);
});

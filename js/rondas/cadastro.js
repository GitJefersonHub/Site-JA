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

  if (!telefoneValido(telefone)) {
    mensagem.textContent = 'Telefone inválido. Use o formato (99) 99999-9999.';
    mensagem.style.color = 'red';
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

  // Verifica se já existe um usuário com o mesmo nome e matrícula
  const duplicado = usuarios.find(u => u.nome === nome && u.matricula === matricula);

  if (duplicado) {
    mensagem.textContent = 'Usuário já existe com esse nome e matrícula.';
    mensagem.style.color = 'red';
    return;
  }

  const novoUsuario = { nome, matricula, telefone, email, senha };
  usuarios.push(novoUsuario);
  localStorage.setItem('usuarios', JSON.stringify(usuarios));

  mensagem.textContent = 'Cadastro realizado com sucesso!';
  mensagem.style.color = 'green';

  // Aguarda 3 segundos antes de limpar e ocultar o formulário
  setTimeout(() => {
    document.getElementById('formCadastro').reset();
    mensagem.textContent = '';

    // Oculta botão e container de cadastro após o cadastro
    document.getElementById('btnCadastrar').style.display = 'none';
    document.querySelector('.cadastrar-container').style.display = 'none';
  }, 3000);
});

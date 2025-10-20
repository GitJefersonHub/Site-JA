// Lógica de cadastro de usuários
document.getElementById('formCadastro').addEventListener('submit', function (e) {
  e.preventDefault();

  const nome = document.getElementById('cadNome').value.trim();
  const matricula = document.getElementById('cadMatricula').value.trim();
  const telefone = document.getElementById('cadTelefone').value.trim();
  const email = document.getElementById('cadEmail').value.trim();
  const senha = document.getElementById('cadSenha').value.trim();
  const dispositivo = identificarDispositivo(navigator.userAgent);
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
  const duplicado = usuarios.find(u => u.matricula === matricula || u.email === email);

  if (duplicado) {
    mensagem.textContent = 'Usuário já cadastrado.';
    mensagem.style.color = 'red';
    return;
  }

  const novoUsuario = { nome, matricula, telefone, email, senha, dispositivo };
  usuarios.push(novoUsuario);
  localStorage.setItem('usuarios', JSON.stringify(usuarios));

  mensagem.textContent = 'Cadastro realizado com sucesso!';
  mensagem.style.color = 'green';
  document.getElementById('formCadastro').reset();
  mostrarFormularioCadastro();
});

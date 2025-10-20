// Lógica de login e verificação de dispositivo
document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const matricula = document.getElementById('matricula').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();
  const dispositivoAtual = identificarDispositivo(navigator.userAgent);
  const mensagem = document.getElementById('mensagem');

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
  const index = usuarios.findIndex(user =>
    user.nome === nome &&
    user.matricula === matricula &&
    user.telefone === telefone &&
    user.email === email &&
    user.senha === senha
  );

  if (index === -1) {
    mensagem.textContent = 'Credenciais inválidas.';
    mensagem.style.color = 'red';
    return;
  }

  const usuario = usuarios[index];

  if (usuario.dispositivo && usuario.dispositivo !== dispositivoAtual) {
    const confirmar = confirm('Este usuário está logado em outro dispositivo. Deseja deslogar o anterior e continuar?');
    if (!confirmar) return;
  }

  usuario.dispositivo = dispositivoAtual;
  usuarios[index] = usuario;
  localStorage.setItem('usuarios', JSON.stringify(usuarios));

  localStorage.setItem('usuarioLogado', 'true');
  localStorage.setItem('dadosUsuario', JSON.stringify(usuario));

  mensagem.textContent = 'Login bem-sucedido!';
  mensagem.style.color = 'green';
  setTimeout(() => {
    location.replace('painel.html');
  }, 1500);
});

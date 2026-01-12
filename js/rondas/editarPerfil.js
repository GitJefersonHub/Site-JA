function editarPerfil() {
  const form = document.getElementById('formEditar');
  const botaoESE = document.querySelector('.btn-ESE');
  const botaoSair = document.querySelector('.btn-sair');
  const botaoLista = document.querySelector('.btn-lista');
  const botaoPonto = document.querySelector('.btn-ponto');
  const botaoRelatorios = document.querySelector('.btn-relatorios');

  if (form.style.display === 'flex') {
    // Oculta formulário e restaura botões
    form.style.display = 'none';
    botaoESE.textContent = 'Editar / Salvar / Excluir';
    botaoSair.style.display = 'inline-block';
    botaoLista.style.display = 'inline-block';
    botaoPonto.style.display = 'inline-block';
    botaoRelatorios.style.display = 'inline-block';
  } else {
    // Exibe formulário e oculta botões
    form.style.display = 'flex';
    botaoESE.textContent = 'Fechar';
    botaoSair.style.display = 'none';
    botaoLista.style.display = 'none';
    botaoPonto.style.display = 'none';
    botaoRelatorios.style.display = 'none';

    const dados = JSON.parse(localStorage.getItem('dadosUsuario'));
    if (!dados) {
      alert('Erro ao carregar dados do usuário.');
      return;
    }

    document.getElementById('editNome').value = dados.nome;
    document.getElementById('editMatricula').value = dados.matricula;
    document.getElementById('editPosto').value = dados.posto;
    document.getElementById('editLocalizacao').value = dados.localizacao;
    document.getElementById('editEmail').value = dados.email;
    document.getElementById('editSenha').value = dados.senha;
  }
}

function toggleSenha() {
  const senhaInput = document.getElementById('editSenha');
  const toggleIcon = document.getElementById('toggleIcon');

  senhaInput.type = senhaInput.type === 'password' ? 'text' : 'password';
  toggleIcon.textContent = senhaInput.type === 'password' ? '👁️' : '🙈';

  // Estilização mantida
  toggleIcon.style.position = 'absolute';
  toggleIcon.style.right = '4%';
  toggleIcon.style.top = '50%';
  toggleIcon.style.transform = 'translateY(-50%)';
  toggleIcon.style.fontSize = '400%';
  toggleIcon.style.cursor = 'pointer';
  toggleIcon.style.color = '#007bff';
  toggleIcon.style.userSelect = 'none';
}

function salvarPerfil() {
  const novoNome = document.getElementById('editNome').value.trim();
  const novaMatricula = document.getElementById('editMatricula').value.trim();
  const novoPosto = document.getElementById('editPosto').value.trim();
  const novaLocalizacao = document.getElementById('editLocalizacao').value.trim();
  const novoEmail = document.getElementById('editEmail').value.trim();
  const novaSenha = document.getElementById('editSenha').value.trim();

  if (!novoNome || !novaMatricula || !novoPosto || !novaLocalizacao || !novoEmail || !novaSenha) {
    alert('Todos os campos devem ser preenchidos.');
    return;
  }

  const novosDados = {
    nome: novoNome,
    matricula: novaMatricula,
    posto: novoPosto,
    localizacao: novaLocalizacao,
    email: novoEmail,
    senha: novaSenha
  };

  const dados = JSON.parse(localStorage.getItem('dadosUsuario'));

  // Atualiza dados do usuário logado
  localStorage.setItem('dadosUsuario', JSON.stringify(novosDados));

  // Atualiza usuário no array de usuários
  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  const index = usuarios.findIndex(u =>
    u.matricula === dados.matricula &&
    u.email === dados.email &&
    u.nome === dados.nome
  );

  if (index !== -1) {
    usuarios[index] = novosDados;
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }

  // Atualiza visual do painel
  document.getElementById('infoNome').textContent = `📌 Nome: ${novoNome}`;
  document.getElementById('infoMatricula').textContent = `📌 Matrícula: ${novaMatricula}`;
  document.getElementById('infoLocalizacao').textContent = `📍 Local: ${novaLocalizacao}`;
  document.getElementById('infoEmail').textContent = `📧 E-mail: ${novoEmail}`;
  document.getElementById('infoSenha').textContent = `🔒 Senha: ${novaSenha}`;
  document.getElementById('formEditar').style.display = 'none';

  alert('Perfil atualizado com sucesso!\n\nPor segurança, você será desconectado e deverá fazer login novamente com os novos dados.');
  localStorage.removeItem('usuarioLogado');
  window.location.replace('rondasLogin.html'); // evita voltar ao formulário
}

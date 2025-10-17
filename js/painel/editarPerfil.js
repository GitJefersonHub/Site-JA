function editarPerfil() {
  const form = document.getElementById('formEditar');

  if (form.style.display === 'flex') {
    // Se já estiver visível, oculta sem salvar
    form.style.display = 'none';
  } else {
    // Se estiver oculto, exibe e preenche os campos
    form.style.display = 'flex';
    document.getElementById('editNome').value = dados.nome;
    document.getElementById('editMatricula').value = dados.matricula;
    document.getElementById('editTelefone').value = dados.telefone;
    document.getElementById('editEmail').value = dados.email;
    document.getElementById('editSenha').value = dados.senha;
  }
}

function toggleSenha() {
  const senhaInput = document.getElementById('editSenha');
  const toggleIcon = document.getElementById('toggleIcon');
  if (senhaInput.type === 'password') {
    senhaInput.type = 'text';
    toggleIcon.textContent = '🙈';
  } else {
    senhaInput.type = 'password';
    toggleIcon.textContent = '👁️';
  }
}

function salvarPerfil() {
  const novoNome = document.getElementById('editNome').value.trim();
  const novaMatricula = document.getElementById('editMatricula').value.trim();
  const novoTelefone = document.getElementById('editTelefone').value.trim();
  const novoEmail = document.getElementById('editEmail').value.trim();
  const novaSenha = document.getElementById('editSenha').value.trim();

  if (!novoNome || !novaMatricula || !novoTelefone || !novoEmail || !novaSenha) {
    alert('Todos os campos devem ser preenchidos.');
    return;
  }

  const novosDados = {
    nome: novoNome,
    matricula: novaMatricula,
    telefone: novoTelefone,
    email: novoEmail,
    senha: novaSenha
  };

  // Salva os dados atualizados
  localStorage.setItem('dadosUsuario', JSON.stringify(novosDados));

  // Atualiza visual do painel
  document.getElementById('infoNome').textContent = `📌 Nome: ${novoNome}`;
  document.getElementById('infoMatricula').textContent = `📌 Matrícula: ${novaMatricula}`;
  document.getElementById('infoTelefone').textContent = `📞 Telefone: ${novoTelefone}`;
  document.getElementById('infoEmail').textContent = `📧 E-mail: ${novoEmail}`;
  document.getElementById('formEditar').style.display = 'none';

  // Alerta e logout
  alert('Perfil atualizado com sucesso!\n\nPor segurança, você será desconectado e deverá fazer login novamente com os novos dados.');
  localStorage.removeItem('usuarioLogado');
  window.location.href = 'login.html';
}



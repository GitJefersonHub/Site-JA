function editarPerfil() {
  const form = document.getElementById('formEditar');

  if (form.style.display === 'flex') {
    // Se já estiver visível, oculta sem salvar
    form.style.display = 'none';
  } else {
    // Se estiver oculto, exibe e preenche os campos
    form.style.display = 'flex';
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
  const novaMatricula = document.getElementById('editMatricula').value.trim();
  const novoTelefone = document.getElementById('editTelefone').value.trim();
  const novoEmail = document.getElementById('editEmail').value.trim();
  const novaSenha = document.getElementById('editSenha').value.trim();

  if (!novaMatricula || !novoTelefone || !novoEmail || !novaSenha) {
    alert('Todos os campos devem ser preenchidos.');
    return;
  }

  const novosDados = {
    matricula: novaMatricula,
    telefone: novoTelefone,
    email: novoEmail,
    senha: novaSenha
  };

  localStorage.setItem('dadosUsuario', JSON.stringify(novosDados));
  alert('Perfil atualizado com sucesso!');

  document.getElementById('infoMatricula').textContent = `📌 Matrícula: ${novaMatricula}`;
  document.getElementById('infoTelefone').textContent = `📞 Telefone: ${novoTelefone}`;
  document.getElementById('infoEmail').textContent = `📧 E-mail: ${novoEmail}`;
  document.getElementById('formEditar').style.display = 'none';

}


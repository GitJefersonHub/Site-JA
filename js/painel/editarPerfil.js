function editarPerfil() {
  const form = document.getElementById('formEditar');

  if (form.style.display === 'flex') {
    form.style.display = 'none';
  } else {
    form.style.display = 'flex';

    const dados = JSON.parse(localStorage.getItem('dadosUsuario'));
    if (!dados) {
      alert('Erro ao carregar dados do usuário.');
      return;
    }

    document.getElementById('editNome').value = dados.nome;
    document.getElementById('editMatricula').value = dados.matricula;
    document.getElementById('editTelefone').value = dados.telefone;
    document.getElementById('editEmail').value = dados.email;
    document.getElementById('editSenha').value = dados.senha;
  }
  aplicarMascaraTelefone('editTelefone');

}

function aplicarMascaraTelefone(idCampo) {
  const campo = document.getElementById(idCampo);
  campo.addEventListener('input', function (e) {
    let input = e.target.value.replace(/\D/g, '').slice(0, 11); // remove tudo que não é número
    let formatted = '';

    if (input.length > 0) {
      formatted += '(' + input.substring(0, 2);
    }
    if (input.length >= 3) {
      formatted += ') ';
      if (input.length >= 7) {
        formatted += input.substring(2, 7) + '-' + input.substring(7, 11);
      } else {
        formatted += input.substring(2);
      }
    }

    e.target.value = formatted;
  });
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
  const novoTelefone = document.getElementById('editTelefone').value.trim();
  const novoEmail = document.getElementById('editEmail').value.trim();
  const novaSenha = document.getElementById('editSenha').value.trim();

  if (!novoNome || !novaMatricula || !novoTelefone || !novoEmail || !novaSenha) {
    alert('Todos os campos devem ser preenchidos.');
    return;
  }

  const telefoneValido = /^\(\d{2}\) \d{5}-\d{4}$/.test(novoTelefone);
  if (!telefoneValido) {
    alert('Telefone inválido. Use o formato (99) 99999-9999.');
    return;
  }

  const novosDados = {
    nome: novoNome,
    matricula: novaMatricula,
    telefone: novoTelefone,
    email: novoEmail,
    senha: novaSenha
  };

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
  document.getElementById('infoTelefone').textContent = `📞 Telefone: ${novoTelefone}`;
  document.getElementById('infoEmail').textContent = `📧 E-mail: ${novoEmail}`;
  document.getElementById('formEditar').style.display = 'none';

  alert('Perfil atualizado com sucesso!\n\nPor segurança, você será desconectado e deverá fazer login novamente com os novos dados.');
  localStorage.removeItem('usuarioLogado');
  window.location.href = 'login.html';
}

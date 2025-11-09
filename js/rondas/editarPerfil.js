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
    document.getElementById('editTelefone').value = dados.telefone;
    document.getElementById('editEmail').value = dados.email;
    document.getElementById('editSenha').value = dados.senha;

    aplicarMascaraTelefone('editTelefone');
  }
}

function aplicarMascaraTelefone(idCampo) {
  const campo = document.getElementById(idCampo);

  campo.addEventListener('input', function (e) {
    let input = e.target.value.replace(/\D/g, '').slice(0, 11); // mantém apenas números
    let formatted = '';

    if (input.length > 0) {
      formatted += '(' + input.substring(0, 2);
    }
    if (input.length >= 3) {
      formatted += ') ' + input.substring(2, 7);
    }
    if (input.length >= 8) {
      formatted += '-' + input.substring(7, 11);
    }

    e.target.value = formatted;
  });

  // Garante que o campo já esteja formatado corretamente ao carregar
  campo.dispatchEvent(new Event('input'));
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
  const novoTelefone = document.getElementById('editTelefone').value.trim();
  const novoEmail = document.getElementById('editEmail').value.trim();
  const novaSenha = document.getElementById('editSenha').value.trim();

  if (!novoNome || !novaMatricula || !novoPosto || !novoTelefone || !novoEmail || !novaSenha) {
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
    posto: novoPosto,
    telefone: novoTelefone,
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
  document.getElementById('infoTelefone').textContent = `📞 Telefone: ${novoTelefone}`;
  document.getElementById('infoEmail').textContent = `📧 E-mail: ${novoEmail}`;
  document.getElementById('infoSenha').textContent = `🔒 Senha: ${novaSenha}`;
  document.getElementById('formEditar').style.display = 'none';

  alert('Perfil atualizado com sucesso!\n\nPor segurança, você será desconectado e deverá fazer login novamente com os novos dados.');
  localStorage.removeItem('usuarioLogado');
  window.location.replace('rondasLogin.html'); // evita voltar ao formulário
}

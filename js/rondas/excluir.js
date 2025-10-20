function excluir() {
  const confirmacao = confirm('Tem certeza que deseja excluir seu cadastro? Esta ação não pode ser desfeita.');

  if (!confirmacao) return;

  const dados = JSON.parse(localStorage.getItem('dadosUsuario'));
  if (!dados) {
    alert('Erro ao localizar dados do usuário.');
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

  const atualizados = usuarios.filter(user =>
    !(user.nome === dados.nome &&
      user.matricula === dados.matricula &&
      user.email === dados.email)
  );

  localStorage.setItem('usuarios', JSON.stringify(atualizados));
  localStorage.removeItem('dadosUsuario');
  localStorage.removeItem('usuarioLogado');

  alert('Cadastro excluído com sucesso. Você será redirecionado para a tela de login.');
  window.location.href = 'rondasLogin.html';
}

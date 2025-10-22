function sair() {
  const confirmar = confirm("Tem certeza de que deseja sair e encerrar a sessão?");

  if (confirmar) {
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('dadosUsuario');
    alert("Sessão encerrada.");
    location.replace('rondasLogin.html');
  }
}

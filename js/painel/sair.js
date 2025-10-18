function sair() {
  localStorage.removeItem('usuarioLogado');
  alert("Saindo...");
  window.location.href = 'login.html';
}


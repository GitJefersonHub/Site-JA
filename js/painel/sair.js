function sair() {
      localStorage.removeItem('usuarioLogado');
      localStorage.removeItem('dadosUsuario');
      alert("Sessão encerrada.");
      location.replace('login.html');
    }
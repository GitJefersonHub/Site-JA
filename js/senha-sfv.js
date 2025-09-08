function verificarSenhaSFV() {
  const maxTentativas = 3;
  const tempoBloqueioHoras = 1;

  const tentativas = parseInt(localStorage.getItem('tentativasSFV') || '0');
  const bloqueadoAte = localStorage.getItem('bloqueadoAte');

  // Verifica se está bloqueado
  if (bloqueadoAte && Date.now() < parseInt(bloqueadoAte)) {
    const restante = Math.ceil((parseInt(bloqueadoAte) - Date.now()) / 60000);
    alert(`Acesso bloqueado por segurança. Tente novamente em ${restante} minutos.`);
    return;
  }

  // Se excedeu tentativas, inicia bloqueio
  if (tentativas >= maxTentativas) {
    const horaFutura = Date.now() + tempoBloqueioHoras * 60 * 60 * 1000;
    localStorage.setItem('bloqueadoAte', horaFutura.toString());
    localStorage.removeItem('tentativasSFV');
    alert(`Você excedeu o número de tentativas. Acesso bloqueado por ${tempoBloqueioHoras} hora(s).`);
    return;
  }

  const senha = prompt(`Digite a senha para acessar (tentativas restantes: ${maxTentativas - tentativas})`);
  if (!senha) return;

  fetch('/.netlify/functions/checkPassword', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ senha })
  })
    .then(res => res.json())
    .then(data => {
      if (data.autorizado) {
        localStorage.removeItem('tentativasSFV');
        localStorage.removeItem('bloqueadoAte');
        window.location.href = '/sfv.html';
      } else {
        localStorage.setItem('tentativasSFV', tentativas + 1);
        const restantes = maxTentativas - (tentativas + 1);
        alert(restantes > 0
          ? `Senha incorreta. Você ainda tem ${restantes} tentativa(s).`
          : `Senha incorreta. Você será bloqueado por ${tempoBloqueioHoras} hora(s).`);
      }
    })
    .catch(err => {
      console.error("Erro ao verificar senha:", err);
      alert("Erro ao verificar senha.");
    });
}

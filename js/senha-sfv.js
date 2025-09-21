// Função para SFV
function verificarSenhaSFV() {
  const maxTentativasSFV = 3;
  const tempoBloqueioHorasSFV = 1;

  const tentativas = parseInt(localStorage.getItem('tentativasSFV') || '0');
  const bloqueadoAte = localStorage.getItem('bloqueadoAteSFV');

  if (bloqueadoAte && Date.now() < parseInt(bloqueadoAte)) {
    const restante = Math.ceil((parseInt(bloqueadoAte) - Date.now()) / 60000);
    alert(`Acesso ao SFV bloqueado. Tente novamente em ${restante} minutos.`);
    return;
  }

  if (tentativas >= maxTentativasSFV) {
    const horaFutura = Date.now() + tempoBloqueioHorasSFV * 60 * 60 * 1000;
    localStorage.setItem('bloqueadoAteSFV', horaFutura.toString());
    localStorage.removeItem('tentativasSFV');
    alert(`Você excedeu o número de tentativas para SFV. Bloqueado por ${tempoBloqueioHorasSFV} hora(s).`);
    return;
  }

  const senha = prompt(`Digite a senha para acessar SFV (tentativas restantes: ${maxTentativasSFV - tentativas})`);
  if (!senha) return;

  fetch('/.netlify/functions/checkPassword', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ senha, tipo: 'sfv' })
  })
    .then(res => res.json())
    .then(data => {
      if (data.autorizado) {
        localStorage.removeItem('tentativasSFV');
        localStorage.removeItem('bloqueadoAteSFV');
        window.location.href = '/sfv.html';
      } else {
        localStorage.setItem('tentativasSFV', tentativas + 1);
        const restantes = maxTentativasSFV - (tentativas + 1);
        alert(restantes > 0
          ? `Senha incorreta para SFV. Você ainda tem ${restantes} tentativa(s).`
          : `Senha incorreta. Você será bloqueado por ${tempoBloqueioHorasSFV} hora(s).`);
      }
    })
    .catch(err => {
      console.error("Erro ao verificar senha SFV:", err);
      alert("Erro ao verificar senha.");
    });
}

// Função para Samurai
function verificarSenhaSamurai() {
  const maxTentativasSamurai = 3;
  const tempoBloqueioHorasSamurai = 12;

  const tentativas = parseInt(localStorage.getItem('tentativasSamurai') || '0');
  const bloqueadoAte = localStorage.getItem('bloqueadoAteSamurai');

  if (bloqueadoAte && Date.now() < parseInt(bloqueadoAte)) {
    const restante = Math.ceil((parseInt(bloqueadoAte) - Date.now()) / 60000);
    alert(`Acesso ao Samurai bloqueado. Tente novamente em ${restante} minutos.`);
    return;
  }

  if (tentativas >= maxTentativasSamurai) {
    const horaFutura = Date.now() + tempoBloqueioHorasSamurai * 60 * 60 * 1000;
    localStorage.setItem('bloqueadoAteSamurai', horaFutura.toString());
    localStorage.removeItem('tentativasSamurai');
    alert(`Você excedeu o número de tentativas para Samurai. Bloqueado por ${tempoBloqueioHorasSamurai} hora(s).`);
    return;
  }

  const senha = prompt(`Digite a senha para acessar Samurai (tentativas restantes: ${maxTentativasSamurai - tentativas})`);
  if (!senha) return;

  fetch('/.netlify/functions/checkPassword', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ senha, tipo: 'samurai' })
  })
    .then(res => res.json())
    .then(data => {
      if (data.autorizado) {
        localStorage.removeItem('tentativasSamurai');
        localStorage.removeItem('bloqueadoAteSamurai');
        window.location.href = '/samurai.html';
      } else {
        localStorage.setItem('tentativasSamurai', tentativas + 1);
        const restantes = maxTentativasSamurai - (tentativas + 1);
        alert(restantes > 0
          ? `Senha incorreta para Samurai. Você ainda tem ${restantes} tentativa(s).`
          : `Senha incorreta. Você será bloqueado por ${tempoBloqueioHorasSamurai} hora(s).`);
      }
    })
    .catch(err => {
      console.error("Erro ao verificar senha Samurai:", err);
      alert("Erro ao verificar senha.");
    });
}

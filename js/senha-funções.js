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

// Função para Metropoles
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

// Função para Ponto Digital
function verificarSenhaPontoDigital() {
  const maxTentativasPonto = 3;
  const tempoBloqueioHorasPonto = 1;

  const tentativas = parseInt(localStorage.getItem('tentativasPonto') || '0');
  const bloqueadoAte = localStorage.getItem('bloqueadoAtePonto');

  if (bloqueadoAte && Date.now() < parseInt(bloqueadoAte)) {
    const restante = Math.ceil((parseInt(bloqueadoAte) - Date.now()) / 60000);
    alert(`Acesso ao Ponto Digital bloqueado. Tente novamente em ${restante} minutos.`);
    return;
  }

  if (tentativas >= maxTentativasPonto) {
    const horaFutura = Date.now() + tempoBloqueioHorasPonto * 60 * 60 * 1000;
    localStorage.setItem('bloqueadoAtePonto', horaFutura.toString());
    localStorage.removeItem('tentativasPonto');
    alert(`Você excedeu o número de tentativas para o Ponto Digital. Bloqueado por ${tempoBloqueioHorasPonto} hora(s).`);
    return;
  }

  const senha = prompt(`Digite a senha para acessar o Ponto Digital (tentativas restantes: ${maxTentativasPonto - tentativas})`);
  if (!senha) return;

  fetch('/.netlify/functions/checkPassword', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ senha, tipo: 'PontoDigital' })
  })
    .then(res => res.json())
    .then(data => {
      if (data.autorizado) {
        localStorage.removeItem('tentativasPonto');
        localStorage.removeItem('bloqueadoAtePonto');
        window.location.href = '/PontoDigital.html';
      } else {
        localStorage.setItem('tentativasPonto', tentativas + 1);
        const restantes = maxTentativasPonto - (tentativas + 1);
        alert(restantes > 0
          ? `Senha incorreta para Ponto Digital. Você ainda tem ${restantes} tentativa(s).`
          : `Senha incorreta. Você será bloqueado por ${tempoBloqueioHorasPonto} hora(s).`);
      }
    })
    .catch(err => {
      console.error("Erro ao verificar senha Ponto Digital:", err);
      alert("Erro ao verificar senha.");
    });
}


// Função para site
function verificarSenhasite() {
  const maxTentativassite = 3;
  const tempoBloqueioHorassite = 1;

  const tentativas = parseInt(localStorage.getItem('tentativassite') || '0');
  const bloqueadoAte = localStorage.getItem('bloqueadoAtesite');

  if (bloqueadoAte && Date.now() < parseInt(bloqueadoAte)) {
    const restante = Math.ceil((parseInt(bloqueadoAte) - Date.now()) / 60000);
    alert(`Acesso ao site bloqueado. Tente novamente em ${restante} minutos.`);
    return;
  }

  if (tentativas >= maxTentativassite) {
    const horaFutura = Date.now() + tempoBloqueioHorasSFV * 60 * 60 * 1000;
    localStorage.setItem('bloqueadoAtesite', horaFutura.toString());
    localStorage.removeItem('tentativassite');
    alert(`Você excedeu o número de tentativas para site. Bloqueado por ${tempoBloqueioHorassite} hora(s).`);
    return;
  }

  const senha = prompt(`Digite a senha para acessar site (tentativas restantes: ${maxTentativassite - tentativas})`);
  if (!senha) return;

  fetch('/.netlify/functions/checkPassword', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ senha, tipo: 'site' })
  })
    .then(res => res.json())
    .then(data => {
      if (data.autorizado) {
        localStorage.removeItem('tentativassite');
        localStorage.removeItem('bloqueadoAteSFV');
        window.location.href = '/site.html';
      } else {
        localStorage.setItem('tentativassite', tentativas + 1);
        const restantes = maxTentativassite - (tentativas + 1);
        alert(restantes > 0
          ? `Senha incorreta para site. Você ainda tem ${restantes} tentativa(s).`
          : `Senha incorreta. Você será bloqueado por ${tempoBloqueioHorasSFV} hora(s).`);
      }
    })
    .catch(err => {
      console.error("Erro ao verificar senha site:", err);
      alert("Erro ao verificar senha.");
    });
}







// Função para Segurança
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
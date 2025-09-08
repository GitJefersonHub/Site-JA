async function verificarSenhaSFV() {
  const senha = prompt("Digite a senha para acessar:");

  if (!senha) return;

  try {
    const res = await fetch('/.netlify/functions/checkPassword', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senha })
    });

    const data = await res.json();

    if (data.autorizado) {
      window.location.href = '/sfv.html';
    } else {
      alert("Senha incorreta.");
    }
  } catch (err) {
    console.error("Erro ao verificar senha:", err);
    alert("Erro ao verificar senha.");
  }
}

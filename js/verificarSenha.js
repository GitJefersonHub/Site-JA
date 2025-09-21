async function verificarSenhaSFV() {
  const senha = prompt("Digite a senha para acessar:");

  if (!senha) {
    alert("Você precisa digitar uma senha.");
    return;
  }

  try {
    const response = await fetch('/.netlify/functions/checkPassword', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senha })
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const { autorizado } = await response.json();

    if (autorizado) {
      window.location.href = '/sfv.html';
    } else {
      alert("Senha incorreta.");
    }
  } catch (error) {
    console.error("Erro ao verificar senha:", error);
    alert("Não foi possível verificar a senha. Tente novamente mais tarde.");
  }
}

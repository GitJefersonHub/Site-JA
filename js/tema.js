export function aplicarTemaAutomatico() {
  const hora = new Date().getHours();
  const body = document.body;

  if (hora < 6 || hora >= 18) {
    body.classList.add('tema-escuro');
  } else {
    body.classList.remove('tema-escuro');
  }
}

document.addEventListener('DOMContentLoaded', aplicarTemaAutomatico);

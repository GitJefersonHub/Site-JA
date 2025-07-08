// Aplica automaticamente o tema escuro com base no horário local
export function aplicarTemaAutomatico() {
  const hora = new Date().getHours(); // Obtém a hora atual (0–23)
  const body = document.body;

  // Se for antes das 6h ou depois das 18h, aplica o tema escuro
  if (hora < 6 || hora >= 18) {
    body.classList.add('tema-escuro');
  } else {
    // Caso contrário, remove o tema escuro
    body.classList.remove('tema-escuro');
  }
}

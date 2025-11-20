// Função para aplicar máscara de telefone brasileiro
function formatarTelefone(valor) {
  // Remove tudo que não for dígito
  valor = valor.replace(/\D/g, "");

  // Aplica máscara conforme tamanho
  if (valor.length <= 10) {
    // Telefone fixo: (XX) XXXX-XXXX
    valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
  } else {
    // Celular: (XX) XXXXX-XXXX
    valor = valor.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
  }

  return valor;
}

// Listener para formatar enquanto digita
const telefoneInput = document.getElementById("telefone");
telefoneInput.addEventListener("input", function (e) {
  e.target.value = formatarTelefone(e.target.value);
});

document.getElementById("btn-enviar").addEventListener("click", function () {
  const nome = document.getElementById("nome");
  const email = document.getElementById("email");
  const telefone = document.getElementById("telefone");
  const mensagem = document.getElementById("mensagem");

  const nomeValor = nome.value.trim();
  const emailValor = email.value.trim();
  const telefoneValor = telefone.value.trim();
  const mensagemValor = mensagem.value.trim();

  // Validação: aceita formatos (XX) XXXX-XXXX ou (XX) XXXXX-XXXX
  const telefoneValido = /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(telefoneValor);
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValor);

  if (!nomeValor) {
    alert("Preencha todos os campos corretamente.");
    nome.focus();
    return;
  }

  if (!emailValido) {
    alert("Preencha todos os campos corretamente.");
    email.focus();
    return;
  }

  if (!telefoneValido) {
    alert("Preencha todos os campos corretamente.");
    telefone.focus();
    return;
  }

  if (!mensagemValor) {
    alert("Preencha todos os campos corretamente.");
    mensagem.focus();
    return;
  }

  const dados = {
    nome: nomeValor,
    email: emailValor,
    telefone: telefoneValor,
    mensagem: mensagemValor
  };

  fetch("https://script.google.com/macros/s/AKfycbx8wPOK6wftPPHRrwIwW84qKA6WK1wRdQhqwPXg0hxxlUr5r-lJ5_nuYtbEd2fSA0ms/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    mode: "no-cors",
    body: JSON.stringify(dados)
  })
  .then(response => response.text())
  .then(data => {
    window.location.href = "tec.html";
  })
  .catch(error => {
    alert("Erro ao enviar mensagem: " + error);
  });
});

document.getElementById("form-contato").addEventListener("submit", function(event) {
    event.preventDefault();
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;
    const mensagem = document.getElementById("mensagem").value;
  
    fetch("https://script.google.com/macros/s/AKfycbzO6pYYHLJd95uL8ZjX6YKq2rw6LS3wmcAERlwFSDJr/dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, telefone, mensagem })
    })
    .then(response => response.text())
    .then(data => alert(data))
    .catch(error => console.error("Erro:", error));
  });
  

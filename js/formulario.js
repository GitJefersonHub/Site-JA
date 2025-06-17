    document.getElementById("btn-enviar").addEventListener("click", function () {
    const nome = document.getElementById("nome");
    const email = document.getElementById("email");
    const telefone = document.getElementById("telefone");
    const mensagem = document.getElementById("mensagem");

    const nomeValor = nome.value.trim();
    const emailValor = email.value.trim();
    const telefoneValor = telefone.value.trim();
    const mensagemValor = mensagem.value.trim();

    const telefoneValido = /^[0-9]{10,15}$/.test(telefoneValor);
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
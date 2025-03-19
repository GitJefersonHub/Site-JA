const tempoInicial = 10 * 3600; // 10 horas em segundos
let tempoRestante;
let sorteioRealizado = localStorage.getItem("sorteioRealizado") === "true"; // Recupera o estado do sorteio

function formatarTempo(tempo) {
    const horas = String(Math.floor(tempo / 3600)).padStart(2, '0');
    const minutos = String(Math.floor((tempo % 3600) / 60)).padStart(2, '0');
    const segundos = String(tempo % 60).padStart(2, '0');
    return `${horas}:${minutos}:${segundos}`;
}

function iniciarCronometro() {
    const cronometro = document.getElementById("cronometro");

    if (!localStorage.getItem("tempoRestante")) {
        // Define o tempo inicial na primeira execução
        localStorage.setItem("tempoRestante", tempoInicial);
    }

    tempoRestante = parseInt(localStorage.getItem("tempoRestante"), 10);
    cronometro.textContent = formatarTempo(tempoRestante);

    const intervalId = setInterval(() => {
        if (tempoRestante > 0) {
            tempoRestante--;
            localStorage.setItem("tempoRestante", tempoRestante); // Salva o progresso no armazenamento local
            cronometro.textContent = formatarTempo(tempoRestante);
        } else {
            clearInterval(intervalId);
            cronometro.classList.add("finalizado");

            if (!sorteioRealizado) {
                sorteioRealizado = true;
                localStorage.setItem("sorteioRealizado", "true"); // Marca o sorteio como realizado
                exibirMensagemSorteio();
            }
        }
    }, 1000);
}

function exibirMensagemSorteio() {
    const mensagemSorteio = document.getElementById("mensagem-sorteio");
    mensagemSorteio.textContent = "Sorteando...";
    mensagemSorteio.classList.add("animacao-sorteio");

    // Após 15 segundos, exibe o resultado do sorteio
    setTimeout(() => {
        mensagemSorteio.textContent = ""; // Remove a mensagem de sorteio
        realizarSorteio();
    }, 15000);
}

function realizarSorteio() {
    const ganhadores = [];
    const chavesParticipantes = Object.keys(numerosConfirmados || {});

    while (ganhadores.length < 5 && chavesParticipantes.length > 0) {
        const indexAleatorio = Math.floor(Math.random() * chavesParticipantes.length);
        const ganhador = chavesParticipantes.splice(indexAleatorio, 1)[0];
        ganhadores.push({ numero: ganhador, nome: numerosConfirmados[ganhador] });
    }

    const resultadoContainer = document.getElementById("resultado-sorteio");
    resultadoContainer.innerHTML = "<h2>Ganhadores:</h2>" +
        ganhadores.map(g => `<p>Número ${g.numero}: ${g.nome}</p>`).join("");
}

// Inicia o cronômetro assim que a página carrega
if (!sorteioRealizado) {
    iniciarCronometro();
} else {
    document.getElementById("cronometro").textContent = "00:00:00";
    document.getElementById("mensagem-sorteio").textContent = "Sorteio já realizado!";
}

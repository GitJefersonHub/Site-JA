const tempoInicial = 86400; // 2592000 Exemplo: 30 dias em segundos //86400 Exemplo: 1 dia em segundo
let tempoRestante = tempoInicial;
let intervalId;

function iniciarCronometro() {
    const cronometro = document.getElementById('cronometro');
    cronometro.textContent = formatarTempo(tempoRestante);

    intervalId = setInterval(() => {
        tempoRestante--;
        cronometro.textContent = formatarTempo(tempoRestante);

        if (tempoRestante <= 0) {
            clearInterval(intervalId);
            cronometro.classList.add('finalizado');
            exibirMensagemSorteio();
        }
    }, 1000);
}

function formatarTempo(tempo) {
    const dias = String(Math.floor(tempo / (60 * 60 * 24))).padStart(2, '0');
    const horas = String(Math.floor((tempo % (60 * 60 * 24)) / (60 * 60))).padStart(2, '0');
    const minutos = String(Math.floor((tempo % (60 * 60)) / 60)).padStart(2, '0');
    const segundos = String(tempo % 60).padStart(2, '0');
    return `${dias}:${horas}:${minutos}:${segundos}`;
}

function exibirMensagemSorteio() {
    const mensagemSorteio = document.getElementById('mensagem-sorteio');
    mensagemSorteio.textContent = "Sorteando...";
    mensagemSorteio.classList.add('animacao-sorteio');

    // Após 15 segundos, exibe o resultado
    setTimeout(() => {
        mensagemSorteio.textContent = ""; // Remove a mensagem de sorteio
        realizarSorteio();
    }, 15000);
}

function realizarSorteio() {
    const ganhadores = [];
    const chavesParticipantes = Object.keys(numerosConfirmados);

    while (ganhadores.length < 5 && chavesParticipantes.length > 0) {
        const indexAleatorio = Math.floor(Math.random() * chavesParticipantes.length);
        const ganhador = chavesParticipantes.splice(indexAleatorio, 1)[0];
        ganhadores.push({ numero: ganhador, nome: numerosConfirmados[ganhador] });
    }

    const resultadoContainer = document.getElementById('resultado-sorteio');
    resultadoContainer.innerHTML = "<h2>Ganhadores:</h2>" +
        ganhadores.map(g => `<p>Número ${g.numero}: ${g.nome}</p>`).join('');
}

// Inicia o cronômetro assim que a página carrega
iniciarCronometro();

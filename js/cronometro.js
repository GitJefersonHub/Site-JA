// Verifica se o sorteio já foi realizado, utilizando o localStorage para armazenar o estado
let sorteioRealizado = localStorage.getItem("sorteioRealizado") === "true";

// Formata o tempo em segundos para o formato hh:mm:ss
function formatarTempo(tempo) {
    const horas = String(Math.floor(tempo / 3600)).padStart(2, '0'); // Calcula horas e adiciona zero à esquerda
    const minutos = String(Math.floor((tempo % 3600) / 60)).padStart(2, '0'); // Calcula minutos restantes
    const segundos = String(tempo % 60).padStart(2, '0'); // Calcula segundos restantes
    return `${horas}:${minutos}:${segundos}`; // Retorna o tempo formatado
}

// Define a data e hora do sorteio e inicia o cronômetro para contagem regressiva
function diadosorteio(dia, mes, ano, hora, minuto) {
    const sorteioData = new Date(ano, mes - 1, dia, hora, minuto); // Cria o objeto Date com data, hora e minutos do sorteio
    const intervalId = setInterval(() => {
        const agora = new Date(); // Obtém a hora atual
        const diferenca = sorteioData - agora; // Calcula a diferença de tempo em milissegundos

        if (diferenca > 0) {
            const segundosTotais = Math.floor(diferenca / 1000); // Converte a diferença para segundos
            document.getElementById("cronometro").textContent = formatarTempo(segundosTotais); // Atualiza o cronômetro no DOM
        } else {
            clearInterval(intervalId); // Para o cronômetro quando o tempo expira
            document.getElementById("cronometro").textContent = "00:00:00"; // Exibe 00:00:00 quando o tempo termina
            if (!sorteioRealizado) { // Verifica se o sorteio ainda não foi realizado
                sorteioRealizado = true; // Define o estado do sorteio como realizado
                localStorage.setItem("sorteioRealizado", "true"); // Armazena o estado no localStorage
                exibirMensagemSorteio(); // Exibe mensagem e inicia o sorteio
            }
        }
    }, 1000); // Executa a função a cada segundo
}

// Exibe a mensagem de "Sorteando..." e inicia o sorteio após 15 segundos
function exibirMensagemSorteio() {
    const mensagemSorteio = document.getElementById("mensagem-sorteio"); // Seleciona o elemento de mensagem do DOM
    mensagemSorteio.textContent = "Sorteando..."; // Define o texto da mensagem
    mensagemSorteio.classList.add("animacao-sorteio"); // Adiciona a animação de sorteio

    // Remove a mensagem e realiza o sorteio após 15 segundos
    setTimeout(() => {
        mensagemSorteio.textContent = ""; // Remove a mensagem do sorteio
        realizarSorteio(); // Realiza o sorteio
    }, 15000); // Aguarda 15 segundos
}

// Seleciona aleatoriamente os ganhadores entre os participantes confirmados
function realizarSorteio() {
    const ganhadores = []; // Array para armazenar os ganhadores
    const chavesParticipantes = Object.keys(numerosConfirmados || {}); // Obtém os participantes confirmados

    while (ganhadores.length < 5 && chavesParticipantes.length > 0) {
        const indexAleatorio = Math.floor(Math.random() * chavesParticipantes.length); // Seleciona índice aleatório
        const ganhador = chavesParticipantes.splice(indexAleatorio, 1)[0]; // Remove e retorna o ganhador selecionado
        ganhadores.push({ numero: ganhador, nome: numerosConfirmados[ganhador] }); // Adiciona o ganhador ao array
    }

    const resultadoContainer = document.getElementById("resultado-sorteio"); // Seleciona o contêiner de resultado do DOM
    resultadoContainer.innerHTML = "<h2>Projeto Rifa:</h2>" +
        ganhadores.map(g => `<p>Num ${g.numero}: ${g.nome}</p>`).join(""); // Exibe os ganhadores no DOM
}

// Exemplo de uso da função diadosorteio
if (!sorteioRealizado) {
    diadosorteio(21, 3, 2025, 6); // Configura a data e hora do sorteio
} else {
    document.getElementById("cronometro").textContent = "Projeto Rifa"; // Exibe mensagem caso o sorteio já tenha sido realizado
    document.getElementById("mensagem-sorteio").textContent = "Sorteio já realizado!"; // Mensagem de sorteio finalizado
}
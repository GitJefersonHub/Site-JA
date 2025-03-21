let sorteioRealizado = localStorage.getItem("sorteioRealizado") === "true"; // Recupera o estado do sorteio 
 
function formatarTempo(tempo) { 
    const horas = String(Math.floor(tempo / 3600)).padStart(2, '0'); 
    const minutos = String(Math.floor((tempo % 3600) / 60)).padStart(2, '0'); 
    const segundos = String(tempo % 60).padStart(2, '0'); 
    return `${horas}:${minutos}:${segundos}`; 
} 
 
function diadosorteio(dia, mes, ano, hora) { 
    const sorteioData = new Date(ano, mes - 1, dia, hora); // Data e hora do sorteio 
    const intervalId = setInterval(() => { 
        const agora = new Date(); // Hora atual 
        const diferenca = sorteioData - agora; // Diferenca em milissegundos 
 
        if (diferenca > 0) { 
            const segundosTotais = Math.floor(diferenca / 1000); 
            document.getElementById("cronometro").textContent = formatarTempo(segundosTotais); 
        } else { 
            clearInterval(intervalId); 
            document.getElementById("cronometro").textContent = "00:00:00"; 
            if (!sorteioRealizado) { 
                sorteioRealizado = true; 
                localStorage.setItem("sorteioRealizado", "true"); 
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
    resultadoContainer.innerHTML = "<h2>Projeto Rifa:</h2>" + 
        ganhadores.map(g => `<p>Num ${g.numero}: ${g.nome}</p>`).join(""); 
} 
 
// Exemplo de uso da função diadosorteio 
if (!sorteioRealizado) { 
    diadosorteio(21, 3, 2025, 6); // Exemplo de data: 20 de março de 2025, 06:00 
} else { 
document.getElementById("cronometro").textContent = "Projeto Rifa"; 
document.getElementById("mensagem-sorteio").textContent = "Sorteio já realizado!"; 
}
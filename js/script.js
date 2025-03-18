const valorPorNumero = 20; // Valor de cada número
let valorArrecadado = 0; // Valor inicial com alguns números já inseridos
let numerosConfirmados = { 
    1: "João", 2: "Maria", 3: "Jef", 4: "Cris", 5: "xxx", 6: "Maria", 7: "Jef", 
    8: "Cris", 9: "xxx", 10: "Maria", 11: "Jef", 12: "Cris", 13: "xxx", 14: "Maria", 
    15: "Jef", 16: "Cris", 17: "João", 18: "Maria", 19: "Jef", 20: "Cris", 25: "xxx", 26: "Maria", 27: "Jef", 
    28: "Cris", 29: "xxx", 30: "Maria", 31: "Jef", 32: "Cris", 33: "xxx", 34: "Maria", 
    35: "Jef", 36: "Cris" 

}; // Exemplo de números confirmados com nomes

const percentuais = {
    quintoGanhador: 0.09,
    quartoGanhador: 0.12,
    terceiroGanhador: 0.15,
    segundoGanhador: 0.18,
    primeiroGanhador: 0.21
};

// Atualiza a página com os valores iniciais
function atualizarValores() {
    valorArrecadado = Object.keys(numerosConfirmados).length * valorPorNumero;

    const valoresDistribuidos = {};
    let totalDistribuido = 0;

    // Calcula os valores com base nos percentuais
    Object.entries(percentuais).forEach(([chave, percentual]) => {
        valoresDistribuidos[chave] = valorArrecadado * percentual;
        totalDistribuido += valoresDistribuidos[chave];
    });

    // Calcula o valor restante para o administrador
    valoresDistribuidos.administrador = valorArrecadado - totalDistribuido;

    // Atualiza os valores no DOM
    Object.entries(valoresDistribuidos).forEach(([chave, valor]) => {
        const elemento = document.getElementById(chave);
        if (elemento) elemento.textContent = valor.toFixed(2);
    });

    atualizarListaParticipantes();
}

// Atualiza a lista de participantes
function atualizarListaParticipantes() {
    const listaContainer = document.getElementById('lista-participantes');
    listaContainer.innerHTML = ''; // Limpa a lista atual

    const listaFlexContainer = document.createElement('div');
    listaFlexContainer.style.display = 'flex';
    listaFlexContainer.style.flexWrap = 'wrap';
    listaContainer.appendChild(listaFlexContainer);

    Object.entries(numerosConfirmados).forEach(([numero, nome]) => {
        const listItem = document.createElement('div');
        listItem.style.margin = '10px'; // Ajuste para espaçamento
        listItem.textContent = `${numero}: ${nome}`;
        listaFlexContainer.appendChild(listItem);
    });
}

// Adiciona ou remove um número confirmado
function modificarNumeroConfirmado(numero, nome = null) {
    if (nome) {
        numerosConfirmados[numero] = nome; // Adiciona um novo número confirmado
    } else {
        delete numerosConfirmados[numero]; // Remove o número confirmado
    }
    atualizarValores();
}

// Inicializa os valores na página
atualizarValores();

// Cria botões dinamicamente e adiciona eventos
const numbersContainer = document.querySelector('.numbers-container');
for (let i = 1; i <= 100; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.className = 'number-btn';
    button.disabled = numerosConfirmados.hasOwnProperty(i); // Desabilita os botões para números já confirmados

    button.addEventListener('click', () => {
        if (confirm(`Número ${i}. Deseja continuar?`)) {
            const numeroWhatsApp = "62982502200"; // Substitua pelo número real
            const mensagem = `Olá! Escolhi o número ${i} na rifa.`;
            const url = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensagem)}`;
            window.open(url, '_blank');

            modificarNumeroConfirmado(i, `aguardando confirmação ${i}`);
            button.disabled = true; // Desabilita o botão após a escolha
        }
    });

    numbersContainer.appendChild(button);
}

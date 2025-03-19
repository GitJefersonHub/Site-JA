const valorPorNumero = 20; // Valor de cada número 
let valorArrecadado = 0; // Valor inicial com alguns números já inseridos 
let numerosConfirmados = { 1: "aaa", 2: "aaa", 3: "aaa", 4: "aaa", 5: "aaa", 6: "aaa", 7: "aaa", 8: "aaa", 9: "bbb", 10: "bbb", 11: "bbb", 12: "bbb", 13: "bbb", 14: "bbb", 15: "bbb", 16: "bbb" }; // Exemplo de números confirmados com nomes 

// Atualiza a página com os valores iniciais 
function atualizarValores() {
    // Calcula o valor arrecadado com base nos números confirmados 
    valorArrecadado = Object.keys(numerosConfirmados).length * valorPorNumero;

    const quintoGanhador = valorArrecadado * 0.05;
    const quartoGanhador = valorArrecadado * 0.10;
    const terceiroGanhador = valorArrecadado * 0.15;
    const segundoGanhador = valorArrecadado * 0.20;
    const primeiroGanhador = valorArrecadado * 0.25;
    const administrador = valorArrecadado - (primeiroGanhador + segundoGanhador + terceiroGanhador + quartoGanhador +
        quintoGanhador);

    document.getElementById('valor-arrecadado').textContent = valorArrecadado.toFixed(2);
    document.getElementById('primeiro-ganhador').textContent = primeiroGanhador.toFixed(2);
    document.getElementById('segundo-ganhador').textContent = segundoGanhador.toFixed(2);
    document.getElementById('terceiro-ganhador').textContent = terceiroGanhador.toFixed(2);
    document.getElementById('quarto-ganhador').textContent = quartoGanhador.toFixed(2);
    document.getElementById('quinto-ganhador').textContent = quintoGanhador.toFixed(2);
    document.getElementById('administrador').textContent = administrador.toFixed(2);

    atualizarListaParticipantes();
}

// Atualiza a lista de números e nomes dos participantes 
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
        // Adiciona um novo número confirmado 
        numerosConfirmados[numero] = nome;
    } else {
        // Remove o número confirmado 
        delete numerosConfirmados[numero];
    }
    atualizarValores();
}

// Inicia os valores na página 
atualizarValores();

// Cria botões dinamicamente e adiciona eventos 
const numbersContainer = document.querySelector('.numbers-container');
for (let i = 1; i <= 100; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.className = 'number-btn';
    button.disabled = numerosConfirmados.hasOwnProperty(i); // Desabilita os botões para números já confirmados 

    button.addEventListener('click', () => {
        // Exibe um alert antes de enviar a mensagem 
        const confirmacao = confirm(`Número ${i}. Deseja continuar?`);
        if (confirmacao) {
            // Envia mensagem para o WhatsApp 
            const numeroWhatsApp = "62982502200"; // Substitua pelo número real 
            const mensagem = `Olá! Escolhi o número ${i} na rifa.`;
            const url =
                `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensagem)}`;
            window.open(url, '_blank');

            // Atualiza a confirmação do número na lista 
            modificarNumeroConfirmado(i, `aguardando confirmação ${i}`);
            button.disabled = true; // Desabilita o botão após a escolha 
        }
    });

    numbersContainer.appendChild(button);
} 
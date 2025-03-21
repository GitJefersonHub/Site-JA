const valorPorNumero = 20; // Define o valor de cada número na rifa
let valorArrecadado = 0; // Inicializa o valor arrecadado
let numerosConfirmados = { 1: "João", 2: "Maria", 3: "Jef", 4: "Cris", 5: "xxx" }; // Lista de números confirmados com nomes

// Atualiza os valores exibidos na página e calcula os ganhos
function atualizarValores() {
    // Calcula o valor arrecadado com base na quantidade de números confirmados
    valorArrecadado = Object.keys(numerosConfirmados).length * valorPorNumero;

    // Calcula a premiação de cada ganhador baseado na porcentagem do valor arrecadado
    const quintoGanhador = valorArrecadado * 0.0512;
    const quartoGanhador = valorArrecadado * 0.0856;
    const terceiroGanhador = valorArrecadado * 0.1294;
    const segundoGanhador = valorArrecadado * 0.1578;
    const primeiroGanhador = valorArrecadado * 0.1834;
    const administrador = valorArrecadado * 0.2632; // Valor destinado ao administrador

    // Atualiza os valores no DOM (interface da página)
    document.getElementById('valor-arrecadado').textContent = valorArrecadado.toFixed(2);
    document.getElementById('primeiro-ganhador').textContent = primeiroGanhador.toFixed(2);
    document.getElementById('segundo-ganhador').textContent = segundoGanhador.toFixed(2);
    document.getElementById('terceiro-ganhador').textContent = terceiroGanhador.toFixed(2);
    document.getElementById('quarto-ganhador').textContent = quartoGanhador.toFixed(2);
    document.getElementById('quinto-ganhador').textContent = quintoGanhador.toFixed(2);
    document.getElementById('administrador').textContent = administrador.toFixed(2);

    atualizarListaParticipantes(); // Chama a função para atualizar a lista de participantes
}

// Atualiza a lista de números e nomes confirmados no DOM
function atualizarListaParticipantes() {
    const listaContainer = document.getElementById('lista-participantes'); // Obtém o contêiner da lista de participantes
    listaContainer.innerHTML = ''; // Limpa o conteúdo atual da lista

    // Cria um contêiner flexível para exibir os participantes
    const listaFlexContainer = document.createElement('div');
    listaFlexContainer.style.display = 'flex';
    listaFlexContainer.style.flexWrap = 'wrap'; // Permite que os itens quebrem linhas
    listaContainer.appendChild(listaFlexContainer);

    // Adiciona cada número e nome confirmado à lista
    Object.entries(numerosConfirmados).forEach(([numero, nome]) => {
        const listItem = document.createElement('div');
        listItem.style.margin = '10px'; // Define o espaçamento entre os itens
        listItem.textContent = `${numero}: ${nome}`; // Exibe o número e o nome do participante
        listaFlexContainer.appendChild(listItem);
    });
}

// Adiciona ou remove um número confirmado na lista
function modificarNumeroConfirmado(numero, nome = null) {
    if (nome) {
        // Adiciona o número e o nome fornecido
        numerosConfirmados[numero] = nome;
    } else {
        // Remove o número da lista de confirmados
        delete numerosConfirmados[numero];
    }
    atualizarValores(); // Atualiza os valores e a interface
}

// Inicializa os valores exibidos na página
atualizarValores();

// Cria botões para os números disponíveis na rifa e configura eventos
const numbersContainer = document.querySelector('.numbers-container'); // Contêiner para os botões de números
for (let i = 1; i <= 20; i++) { // Cria botões para números de 1 a 20
    const button = document.createElement('button');
    button.textContent = i; // Define o texto do botão como o número
    button.className = 'number-btn'; // Adiciona uma classe CSS ao botão
    button.disabled = numerosConfirmados.hasOwnProperty(i); // Desabilita botões já confirmados

    // Adiciona um evento de clique ao botão
    button.addEventListener('click', () => {
        // Exibe um alerta de confirmação antes de prosseguir
        const confirmacao = confirm(`Número ${i}. Deseja continuar?`);
        if (confirmacao) {
            // Gera um link para enviar mensagem via WhatsApp
            const numeroWhatsApp = "62982502200"; // Número de telefone do WhatsApp
            const mensagem = `Olá! Escolhi o número ${i} na rifa.`;
            const url = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensagem)}`;
            window.open(url, '_blank'); // Abre o link em uma nova aba

            // Adiciona o número como "aguardando confirmação" e desabilita o botão
            modificarNumeroConfirmado(i, `aguardando confirmação ${i}`);
            button.disabled = true;
        }
    });

    numbersContainer.appendChild(button); // Adiciona o botão ao contêiner
}

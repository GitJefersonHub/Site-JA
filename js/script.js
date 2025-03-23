// Define o valor de cada número na rifa 
const valorPorNumero = 20; // Cada número custa R$20. 
let valorArrecadado = 0; // Inicializa o valor total arrecadado. 
 
// Lista de números confirmados com nomes 
let numerosConfirmados = {
    1: "João", 2: "Maria", 3: "Jef", 4: "Cris", 5: "xxx", 6: "José", 7: "xxx",8: "Ana",

    9: "xxx", 10: "Bernardo", 11: "Josiane", 12: "José Maria", 13: "xxx", 14: "Otávio", 15: "Flavio", 16: "Geremias",

    17: "Carlos", 18: "Joana Dark", 19: "Denis", 20: "Cristiano", 21: "Jef", 22: "Cris",23: "xxx", 24: "Maria", 

    25: "xxx", 26: "Socorro", 27: "xxx", 28: "Cris", 29: "xxx", 30: "Maria", 31: "Jef", 32: "Cris",

    33: "xxx", 34: "Maria", 35: "Escofiled", 36: "Sebastião", 37: "Jef", 38: "Cris", 39: "xxx", 40: "Maria",

    41: "João", 42: "Maria", 43: "Jef", 44: "Cris", 45: "xxx", 46: "José", 47: "xxx", 48: "Ana",

    49: "xxx", 50: "Bernardo", 51: "Josiane", 52: "José Maria", 53: "xxx", 54: "Otávio", 55: "Flavio", 56: "Geremias",

    57: "Carlos", 58: "Joana Dark", 59: "Denis", 60: "Cristiano", 61: "João", 62: "Maria", 63: "Jef", 64: "Cris",

    65: "xxx", 66: "Socorro", 67: "xxx", 68: "Cris", 69: "xxx", 70: "Maria", 71: "Jef", 72: "Cris",

    73: "xxx", 74: "Maria", 75: "Escofiled", 76: "Sebastião", 77: "Jef", 78: "Cris", 79: "xxx", 80: "Maria",

    81: "João", 82: "Maria", 83: "Jef", 84: "Cris", 85: "xxx", 86: "Socorro", 87: "xxx", 88: "Cris",

    89: "xxx", 90: "Maria", 91: "Jef", 92: "Cris", 93: "xxx", 94: "Maria", 95: "Escofiled", 96: "Sebastião",

    97: "Jef", 98: "Cris", 99: "xxx", 100: "Maria", 101: "Jef", 102: "Cris", 103: "xxx", 104: "Maria",

}; // Objeto para armazenar números e seus respectivos nomes. 
 
// Atualiza os valores exibidos na página e calcula os ganhos 
function atualizarValores() { 
    // Calcula o valor total arrecadado com base nos números confirmados 
    valorArrecadado = Object.keys(numerosConfirmados).length * valorPorNumero; 
 
    // Calcula os valores das premiações com base nas porcentagens 
    const quintoGanhador = valorArrecadado * 0.0291; // 2,91% do total arrecadado. 
    const quartoGanhador = valorArrecadado * 0.0459; // 4,59%. 
    const terceiroGanhador = valorArrecadado * 0.0629; // 6,29%. 
    const segundoGanhador = valorArrecadado * 0.08237; // 8,237%. 
    const primeiroGanhador = valorArrecadado * 0.10514; // 10,514%. 
    const manutencao = valorArrecadado * 0.0699; // 6,99% destinados à manutenção. 
 
    // Calcula o valor restante para o cliente após deduzir premiações e manutenção 
    const cliente = valorArrecadado - ( 
        quintoGanhador + 
        quartoGanhador + 
        terceiroGanhador + 
        segundoGanhador + 
        primeiroGanhador + 
        manutencao 
    ); 
 
    // Atualiza os valores no DOM (interface da página) 
    document.getElementById('valor-arrecadado').textContent = valorArrecadado.toFixed(2); // Valor total arrecadado. 
    document.getElementById('manutenção').textContent = manutencao.toFixed(2); // Valor da manutenção. 
    document.getElementById('primeiro-ganhador').textContent = primeiroGanhador.toFixed(2); // Premiação do 1º ganhador. 
    document.getElementById('segundo-ganhador').textContent = segundoGanhador.toFixed(2); // Premiação do 2º ganhador. 
    document.getElementById('terceiro-ganhador').textContent = terceiroGanhador.toFixed(2); // Premiação do 3º ganhador. 
    document.getElementById('quarto-ganhador').textContent = quartoGanhador.toFixed(2); // Premiação do 4º ganhador. 
    document.getElementById('quinto-ganhador').textContent = quintoGanhador.toFixed(2); // Premiação do 5º ganhador. 
    document.getElementById('cliente').textContent = cliente.toFixed(2); // Valor restante para o cliente. 
 
    atualizarListaParticipantes(); // Atualiza a lista de participantes na interface. 
} 
 
// Atualiza a lista de números e nomes confirmados no DOM 
function atualizarListaParticipantes() { 
    const listaContainer = document.getElementById('lista-participantes'); 
    listaContainer.innerHTML = ''; // Limpa o conteúdo atual da lista. 
 
    // Cria um contêiner flexível para exibir os participantes 
    const listaFlexContainer = document.createElement('div'); 
    listaFlexContainer.style.display = 'flex'; // Define a disposição em linhas flexíveis. 
    listaFlexContainer.style.flexWrap = 'wrap'; // Permite que os itens se ajustem automaticamente. 
    listaContainer.appendChild(listaFlexContainer); 
 
    // Adiciona cada número e nome confirmado à lista 
    Object.entries(numerosConfirmados).forEach(([numero, nome]) => { 
        const listItem = document.createElement('div'); 
        listItem.style.margin = '10px'; // Espaçamento entre os itens. 
        listItem.textContent = `${numero}: ${nome}`; // Exibe número e nome confirmados. 
        listaFlexContainer.appendChild(listItem); // Adiciona o item ao contêiner. 
    }); 
} 
 
// Adiciona ou remove um número confirmado na lista 
function modificarNumeroConfirmado(numero, nome = null) { 
    if (nome) { 
        numerosConfirmados[numero] = nome; // Adiciona o número com o nome no objeto. 
    } else { 
        delete numerosConfirmados[numero]; // Remove o número do objeto. 
    } 
    atualizarValores(); // Atualiza valores e interface após alterações. 
} 
// Inicializa os valores exibidos na página 
atualizarValores(); // Exibe os valores iniciais na interface. 
// Cria botões para os números disponíveis na rifa e configura eventos 
const numbersContainer = document.querySelector('.numbers-container'); 
for (let i = 1; i <= 104; i++) { // Loop para criar botões de 1 a 104. 
const button = document.createElement('button'); 
button.textContent = i; // Define o texto do botão com o número. 
button.className = 'number-btn'; // Adiciona classe ao botão. 
button.disabled = numerosConfirmados.hasOwnProperty(i); // Desativa botão se o número já estiver confirmado. 
// Adiciona um evento de clique ao botão 
button.addEventListener('click', () => { 
const confirmacao = confirm(`Número ${i}. Deseja continuar?`); // Confirmação antes de prosseguir. 
if (confirmacao) { 
const numeroWhatsApp = "62982502200"; // Número de WhatsApp para envio. 
const mensagem = `Olá! Escolhi o número ${i} na rifa.`; // Mensagem a ser enviada. 
const url = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensagem)}`; 
window.open(url, '_blank'); // Abre a URL do WhatsApp em nova aba. 
modificarNumeroConfirmado(i, `aguardando confirmação ${i}`); // Marca o número como aguardando confirmação. 
button.disabled = true; // Desativa o botão após a escolha. 
} 
}); 
numbersContainer.appendChild(button); // Adiciona o botão ao contêiner na interface. 
} 
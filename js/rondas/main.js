// Proteção contra acesso direto sem login
const dados = JSON.parse(localStorage.getItem('dadosUsuario'));

if (!dados || !dados.nome || !dados.matricula || !dados.localizacao || !dados.posto ) {
  alert('Dados de usuário inválidos. Faça login novamente.');
  localStorage.removeItem('usuarioLogado');
  localStorage.removeItem('dadosUsuario');
  location.replace('rondasLogin.html');
}

// Saudação com base no horário
function gerarSaudacao(nome) {
  const hora = new Date().getHours();
  let saudacao = 'Olá';

  if (hora >= 5 && hora < 12) {
    saudacao = 'Bom dia';
  } else if (hora >= 12 && hora < 18) {
    saudacao = 'Boa tarde';
  } else {
    saudacao = 'Boa noite';
  }

  return `${saudacao}, ${nome}!`;
}

// Exibe dados no painel
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('boasVindas').textContent = gerarSaudacao(dados.nome);
  document.getElementById('infoNome').textContent = `🆔 Nome: ${dados.nome}`;
  document.getElementById('infoMatricula').textContent = `📌 Matrícula: ${dados.matricula}`;
  document.getElementById('infoLocalizacao').textContent = `📍 Local: ${dados.localizacao}`;
  document.getElementById('infoPosto').textContent = `🏢 Posto: ${dados.posto}`;
});

// funções dos botões Modal
function registrar() {
  document.getElementById('modalRegistro').style.display = 'flex';
}

function fecharModal() {
  document.getElementById('modalRegistro').style.display = 'none';
}

// Mapeamento de QR Codes para nomes legíveis
const identificacoesQRCode = {
  "0": "Abertura",
  "1": "1° Andar",
  "2": "2° Andar",
  "3": "3° Andar",
  "4": "4° Andar",
  "5": "5° Andar",
  "6": "Veículos",
  "7": "Térreo",
  "8": "Capela",
  "9": "Bloco A/B"
};

// Variáveis para observação
let tipoRegistro = '';
let dadosQRCode = null;

// Campo de contagem regressiva
document.getElementById('campoObservacao').addEventListener('input', () => {
  const restante = 60 - document.getElementById('campoObservacao').value.length;
  document.getElementById('contadorObservacao').textContent = `${restante} restantes`;
});

function solicitarObservacao(tipo, dados = null) {
  tipoRegistro = tipo;
  dadosQRCode = dados;

  // Verifica se leitura está dentro do intervalo de 12h após abertura
  if (tipo === 'QR Code' && dados !== "0") {
    const aberturaHora = localStorage.getItem('aberturaHora');
    if (!aberturaHora) {
      alert("Você precisa registrar a Abertura antes de continuar.");
      return;
    }

    const agora = new Date();
    const abertura = new Date(aberturaHora);
    const limite = new Date(abertura.getTime() + 12 * 60 * 60 * 1000);

    if (agora < abertura || agora > limite) {
      alert("Fora do intervalo permitido entre Abertura e Fechamento.");
      return;
    }
  }

  document.getElementById('campoObservacao').value = '';
  document.getElementById('contadorObservacao').textContent = '60 restantes';
  document.getElementById('modalObservacao').style.display = 'flex';
}

function confirmarObservacao() {
  const campo = document.getElementById('campoObservacao');
  const observacao = (campo?.value || '').trim();

  // Exige que o usuário digite algo; não insere mais texto automático
  if (!observacao) {
    alert('Insira alguma observação');
    campo?.focus();
    return;
  }

  const agora = new Date();
  const agoraFormatado = agora.toLocaleString('pt-BR');
  const listaPonto = JSON.parse(localStorage.getItem('Ponto')) || [];

  const registro = {
    tipo: tipoRegistro,
    dataHora: agoraFormatado,
    obs: observacao
  };

  if (tipoRegistro === 'QR Code' && dadosQRCode) {
    const nomeQRCode = identificacoesQRCode[dadosQRCode] || `QR Code ${dadosQRCode}`;
    registro.registro = nomeQRCode;

    // Se for abertura, salva hora e agenda fechamento automático
    if (dadosQRCode === "0") {
      localStorage.setItem('aberturaHora', agora.toISOString());

      setTimeout(() => {
        const listaAtualizada = JSON.parse(localStorage.getItem('Ponto')) || [];
        const fechamento = {
          tipo: 'QR Code',
          dataHora: new Date().toLocaleString('pt-BR'),
          obs: 'Sem mais',
          registro: 'Fechamento'
        };
        listaAtualizada.push(fechamento);
        localStorage.setItem('Ponto', JSON.stringify(listaAtualizada));
        alert('Registro automático de Fechamento realizado.');
      }, 12 * 60 * 60 * 1000); // 12 horas
    }
  } else {
    registro.registro = tipoRegistro;
  }

  listaPonto.push(registro);
  localStorage.setItem('Ponto', JSON.stringify(listaPonto));

  alert(`${registro.registro} registrado com sucesso!`);
  document.getElementById('modalObservacao').style.display = 'none';
  fecharModal();
}

function cancelarObservacao() {
  alert('Registro cancelado pelo usuário.');
  document.getElementById('modalObservacao').style.display = 'none';
  fecharModal();
}

// Botão de ponto
function registrarPonto() {
  solicitarObservacao('Móvel');
}

function iniciarContadorFechamento() {
  const aberturaHora = localStorage.getItem('aberturaHora');
  const contadorEl = document.getElementById('contadorFechamento');

  if (!aberturaHora || !contadorEl) return;

  function atualizarContador() {
    const agora = new Date();
    const abertura = new Date(aberturaHora);
    const limite = new Date(abertura.getTime() + 12 * 60 * 60 * 1000);
    const restanteMs = limite - agora;

    if (restanteMs <= 0) {
      contadorEl.textContent = "⏱️ Aguardando nova abertura.";
      return;
    }

    const horas = Math.floor(restanteMs / (1000 * 60 * 60));
    const minutos = Math.floor((restanteMs % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((restanteMs % (1000 * 60)) / 1000);

    contadorEl.textContent = `⏳ ${horas}:${minutos}:${segundos}`;
  }

  atualizarContador(); // inicial
  setInterval(atualizarContador, 1000); // atualiza a cada segundo
}

// Inicia o contador ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  iniciarContadorFechamento();
});

// Proteção contra acesso direto sem login
const dados = JSON.parse(localStorage.getItem('dadosUsuario'));

if (!dados || !dados.nome || !dados.matricula || !dados.localizacao || !dados.posto) {
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
  const restante = 55 - document.getElementById('campoObservacao').value.length;
  document.getElementById('contadorObservacao').textContent = `${restante} restantes`;
});

function solicitarObservacao(tipo, dados = null) {
  tipoRegistro = tipo;
  dadosQRCode = dados;

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
  document.getElementById('contadorObservacao').textContent = '55 restantes';
  document.getElementById('modalObservacao').style.display = 'flex';
}

// 🔍 Função para obter localização atual em formato "lat,lon"
function obterLocalizacaoAtual(callback) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lon = pos.coords.longitude.toFixed(6);
        callback(`${lat},${lon}`);
      },
      () => {
        callback('Não encontrada');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  } else {
    callback('Não encontrada');
  }
}

function confirmarObservacao() {
  const campo = document.getElementById('campoObservacao');
  const observacao = (campo?.value || '').trim();

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
    obs: observacao,
    registro: tipoRegistro
  };

  if (tipoRegistro === 'QR Code' && dadosQRCode) {
    const nomeQRCode = identificacoesQRCode[dadosQRCode] || `QR Code ${dadosQRCode}`;
    registro.registro = nomeQRCode;

    if (dadosQRCode === "0") {
      localStorage.setItem('aberturaHora', agora.toISOString());

      setTimeout(() => {
        const listaAtualizada = JSON.parse(localStorage.getItem('Ponto')) || [];
        const fechamento = {
          tipo: 'QR Code',
          dataHora: new Date().toLocaleString('pt-BR'),
          obs: 'Sem mais',
          registro: 'Fechamento',
          localizacao: 'Não encontrada'
        };
        listaAtualizada.push(fechamento);
        localStorage.setItem('Ponto', JSON.stringify(listaAtualizada));
        alert('Registro automático de Fechamento realizado.');
      }, 12 * 60 * 60 * 1000);
    }
  }

  // Captura localização ANTES de salvar
  obterLocalizacaoAtual((loc) => {
    registro.localizacao = loc;
    listaPonto.push(registro);
    localStorage.setItem('Ponto', JSON.stringify(listaPonto));

    alert(`${registro.registro} registrado com sucesso!`);
    document.getElementById('modalObservacao').style.display = 'none';
    fecharModal();
  });
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

  atualizarContador();
  setInterval(atualizarContador, 1000);
}


// Função para abrir modal de resumo
function abrirModalResumo() {
  document.getElementById('modalRegistro').style.display = 'none';
  document.getElementById('campoResumo').value = '';
  document.getElementById('contadorResumo').textContent = '2000 restantes';
  document.getElementById('modalResumo').style.display = 'flex';
}

// Confirmar resumo
function confirmarResumo() {
  const campo = document.getElementById('campoResumo');
  const resumoTexto = (campo?.value || '').trim();

  if (!resumoTexto) {
    alert('Por favor, insira um resumo da jornada.');
    campo?.focus();
    return;
  }

  const agora = new Date();
  const dataHora = agora.toLocaleString('pt-BR');
  const dadosUsuario = JSON.parse(localStorage.getItem('dadosUsuario')) || {};
  const listaResumo = JSON.parse(localStorage.getItem('Resumo')) || [];

  const registroResumo = {
    dataHora,
    resumo: resumoTexto,
    nome: dadosUsuario.nome || '---',
    matricula: dadosUsuario.matricula || '---',
    localizacao: dadosUsuario.localizacao || 'Não informado',
    posto: dadosUsuario.posto || '---'
  };

  listaResumo.push(registroResumo);
  localStorage.setItem('Resumo', JSON.stringify(listaResumo));

  alert('Resumo registrado com sucesso!');
  document.getElementById('modalResumo').style.display = 'none';
  criarTabelaResumo();
}

// Cancelar resumo
function cancelarResumo() {
  document.getElementById('modalResumo').style.display = 'none';
}

// Atualizar contador de caracteres
document.addEventListener('DOMContentLoaded', () => {
  const campoResumo = document.getElementById('campoResumo');
  if (campoResumo) {
    campoResumo.addEventListener('input', () => {
      const restante = 2000 - campoResumo.value.length;
      document.getElementById('contadorResumo').textContent = `${restante} restantes`;
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  iniciarContadorFechamento();
});

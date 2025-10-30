// Proteção contra acesso direto sem login
const dados = JSON.parse(localStorage.getItem('dadosUsuario'));

if (!dados || !dados.nome || !dados.matricula || !dados.telefone || !dados.email || !dados.senha) {
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
  document.getElementById('infoTelefone').textContent = `📞 Telefone: ${dados.telefone}`;
  document.getElementById('infoEmail').textContent = `📧 E-mail: ${dados.email}`;
  document.getElementById('infoSenha').textContent = `👁️ Senha: ${dados.senha}`;
});

// funções dos botões Modal
function registrar() {
  document.getElementById('modalRegistro').style.display = 'flex';
}

function fecharModal() {
  document.getElementById('modalRegistro').style.display = 'none';
}

// Variáveis para observação
let tipoRegistro = '';
let dadosQRCode = null;

// Campo de contagem regressiva
document.getElementById('campoObservacao').addEventListener('input', () => {
  const restante = 50 - document.getElementById('campoObservacao').value.length;
  document.getElementById('contadorObservacao').textContent = `${restante} caracteres restantes`;
});

function solicitarObservacao(tipo, dados = null) {
  tipoRegistro = tipo;
  dadosQRCode = dados;
  document.getElementById('campoObservacao').value = '';
  document.getElementById('contadorObservacao').textContent = '50 caracteres restantes';
  document.getElementById('modalObservacao').style.display = 'flex';
}

function confirmarObservacao() {
  let observacao = document.getElementById('campoObservacao').value.trim();
  if (observacao === '') observacao = 'Sem observação a relatar';

  const agora = new Date().toLocaleString('pt-BR');
  const listaPonto = JSON.parse(localStorage.getItem('Ponto')) || [];

  const registro = {
    tipo: tipoRegistro,
    dataHora: agora,
    obs: observacao,
    registro: tipoRegistro
  };

  if (tipoRegistro === 'QR Code' && dadosQRCode) {
    registro.localizacao = `QR Code ${dadosQRCode}`;
  }

  listaPonto.push(registro);
  localStorage.setItem('Ponto', JSON.stringify(listaPonto));

  alert(`${tipoRegistro} registrado com sucesso!`);
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
  solicitarObservacao('Ponto');
}

// Novo fluxo para QR Code
let leitorAtivo = false;
let html5QrCodeInstance = null;
let leituraTimeout = null;

function registrarQRCode() {
  if (leitorAtivo) return;

  leitorAtivo = true;
  const readerElement = document.getElementById('reader');
  readerElement.style.display = 'block';
  readerElement.innerHTML = `
    <p id="leituraStatus" style="text-align: center; font-size: 240%; color: #555;">Aguardando leitura…</p>
  `;

  html5QrCodeInstance = new Html5Qrcode("reader");

  Html5Qrcode.getCameras().then(cameras => {
    if (!cameras || cameras.length === 0) {
      alert("Nenhuma câmera disponível.");
      leitorAtivo = false;
      return;
    }

    const backCamera = cameras.find(cam => cam.label.toLowerCase().includes('back') || cam.label.toLowerCase().includes('rear'));
    const cameraId = backCamera ? backCamera.id : cameras[0].id;

    html5QrCodeInstance.start(
      cameraId,
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        if (["1", "2", "3", "4", "5"].includes(decodedText)) {
          clearTimeout(leituraTimeout);
          html5QrCodeInstance.stop().then(() => {
            readerElement.innerHTML = '';
            readerElement.style.display = 'none';
            leitorAtivo = false;

            solicitarObservacao('QR Code', decodedText);
          }).catch(err => {
            alert("Erro ao parar a câmera: " + err);
            leitorAtivo = false;
          });
        }
      },
      (errorMessage) => {
        // erros de leitura podem ser ignorados
      }
    ).catch(err => {
      alert("Erro ao iniciar a câmera: " + err);
      leitorAtivo = false;
    });

    leituraTimeout = setTimeout(() => {
      html5QrCodeInstance.stop().then(() => {
        readerElement.innerHTML = '';
        readerElement.style.display = 'none';
        leitorAtivo = false;
        alert("QR Code correspondente não encontrado.");
        fecharModal();
      }).catch(err => {
        alert("Erro ao cancelar leitura: " + err);
      });
    }, 15000);
  }).catch(err => {
    alert("Erro ao acessar as câmeras: " + err);
    leitorAtivo = false;
  });
}

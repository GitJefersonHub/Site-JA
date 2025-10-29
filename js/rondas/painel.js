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

function registrarPonto() {
  const agora = new Date().toLocaleString('pt-BR');
  let observacao = prompt('Deseja adicionar uma observação? (até 50 caracteres)');

  if (observacao === null) {
    alert('Registro cancelado pelo usuário.');
    fecharModal();
    return;
  }

  observacao = observacao.trim();
  if (observacao === '') {
    observacao = 'Sem observação a relatar';
  } else {
    observacao = observacao.substring(0, 50);
  }

  const listaPonto = JSON.parse(localStorage.getItem('Ponto')) || [];
  listaPonto.push({
    tipo: 'Ponto',
    dataHora: agora,
    obs: observacao,
    registro: 'Ponto'
  });

  localStorage.setItem('Ponto', JSON.stringify(listaPonto));
  alert('Ponto registrado com sucesso!');
  fecharModal();
}

// Novo fluxo para QR Code
let leitorAtivo = false;
let html5QrCodeInstance = null;

function registrarQRCode() {
  if (leitorAtivo) return;

  leitorAtivo = true;
  const readerElement = document.getElementById('reader');
  readerElement.style.display = 'block';
  readerElement.innerHTML = `
    <p id="leituraStatus" style="text-align: center; font-size: 240%; color: #555;">Aguardando leitura…</p>
    <button onclick="cancelarLeitura()" style="display: block; margin: 2rem auto; font-size: 240%; padding: 2%; background-color: #dc3545; color: white; border: none; border-radius: 10px; cursor: pointer;">
      Cancelar leitura
    </button>
  `;

  html5QrCodeInstance = new Html5Qrcode("reader");

  Html5Qrcode.getCameras().then(cameras => {
    if (!cameras || cameras.length === 0) {
      alert("Nenhuma câmera disponível.");
      leitorAtivo = false;
      return;
    }

    const cameraId = cameras[0].id;

    html5QrCodeInstance.start(
      cameraId,
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        html5QrCodeInstance.stop().then(() => {
          readerElement.innerHTML = '';
          readerElement.style.display = 'none';
          leitorAtivo = false;

          let observacao = prompt('Deseja adicionar uma observação para o QR Code? (até 50 caracteres)');
          if (observacao === null) {
            alert('Registro cancelado pelo usuário.');
            fecharModal();
            return;
          }

          observacao = observacao.trim();
          if (observacao === '') {
            observacao = 'Sem observação a relatar';
          } else {
            observacao = observacao.substring(0, 50);
          }

          const agora = new Date().toLocaleString('pt-BR');
          const listaPonto = JSON.parse(localStorage.getItem('Ponto')) || [];
          listaPonto.push({
            tipo: 'QR Code',
            dataHora: agora,
            obs: observacao,
            registro: 'QR Code',
            localizacao: `QR Code ${decodedText}`
          });
          localStorage.setItem('Ponto', JSON.stringify(listaPonto));

          alert(`QR Code ${decodedText} registrado com sucesso!`);
          fecharModal();
        }).catch(err => {
          alert("Erro ao parar a câmera: " + err);
          leitorAtivo = false;
        });
      },
      (errorMessage) => {
        // erros de leitura podem ser ignorados
      }
    ).catch(err => {
      alert("Erro ao iniciar a câmera: " + err);
      leitorAtivo = false;
    });
  }).catch(err => {
    alert("Erro ao acessar as câmeras: " + err);
    leitorAtivo = false;
  });
}

function cancelarLeitura() {
  if (html5QrCodeInstance) {
    html5QrCodeInstance.stop().then(() => {
      document.getElementById('reader').innerHTML = '';
      document.getElementById('reader').style.display = 'none';
      leitorAtivo = false;
    }).catch(err => {
      alert("Erro ao cancelar leitura: " + err);
    });
  }
}

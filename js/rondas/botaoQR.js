// Lógica do botão QR Code
let leitorAtivo = false;
let html5QrCodeInstance = null;
let leituraTimeout = null;

function registrarQRCode() {
  if (leitorAtivo) return;

  leitorAtivo = true;
  const readerElement = document.getElementById('reader');
  readerElement.style.display = 'block';
  document.getElementById('leituraStatus').textContent = 'Aguardando leitura…';

  html5QrCodeInstance = new Html5Qrcode("reader");

  Html5Qrcode.getCameras().then(cameras => {
    if (!cameras || cameras.length === 0) {
      alert("Nenhuma câmera disponível.");
      leitorAtivo = false;
      return;
    }

    const backCamera = cameras.find(cam =>
      cam.label.toLowerCase().includes('back') ||
      cam.label.toLowerCase().includes('rear')
    );
    const cameraId = backCamera ? backCamera.id : cameras[0].id;

    html5QrCodeInstance.start(
      cameraId,
      { fps: 10, qrbox: { width: 400, height: 400 } },
      (decodedText) => {
        // Verifica se o QR Code é válido
        if (Object.keys(identificacoesQRCode).includes(decodedText)) {
          // Verifica se está dentro do intervalo permitido
          if (decodedText !== "0") {
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

          // Se tudo estiver ok, registra o QR Code
          clearTimeout(leituraTimeout);
          html5QrCodeInstance.stop().then(() => {
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

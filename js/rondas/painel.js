// Proteção contra acesso direto sem login
// Carrega dados do usuário logado
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
});

// funções dos botões Modal
function registrar() {
  document.getElementById('modalRegistro').style.display = 'flex';
}

function registrarPonto() {
  const agora = new Date().toLocaleString('pt-BR');
  let observacao = prompt('Deseja adicionar uma observação? (até 50 caracteres)');

  if (observacao === null) {
    // Usuário cancelou — não registra o ponto
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
  listaPonto.push({ tipo: 'Ponto', dataHora: agora, obs: observacao });
  localStorage.setItem('Ponto', JSON.stringify(listaPonto));
  alert('Ponto registrado com sucesso!');
  fecharModal();
}


function registrarQRCode() {
  const agora = new Date().toLocaleString('pt-BR');
  const listaQRCode = JSON.parse(localStorage.getItem('QRCode')) || [];
  listaQRCode.push({ tipo: 'QR Code', dataHora: agora });
  localStorage.setItem('QRCode', JSON.stringify(listaQRCode));
  alert('QR Code gerado!');
  fecharModal();
}

function fecharModal() {
  document.getElementById('modalRegistro').style.display = 'none';
}
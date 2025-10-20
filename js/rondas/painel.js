// Proteção contra acesso direto sem login
if (localStorage.getItem('usuarioLogado') !== 'true') {
  alert('Acesso não autorizado. Faça login para continuar.');
  location.replace('login.html');
}

// Função para identificar tipo de dispositivo e sistema operacional
function identificarDispositivo(userAgent) {
  let dispositivo = 'Desconhecido';
  let sistema = 'Desconhecido';

  if (/Mobi|Android/i.test(userAgent)) {
    dispositivo = 'Mobile';
  } else if (/Tablet|iPad/i.test(userAgent)) {
    dispositivo = 'Tablet';
  } else {
    dispositivo = 'Desktop';
  }

  if (/Windows/i.test(userAgent)) {
    sistema = 'Windows';
  } else if (/Android/i.test(userAgent)) {
    sistema = 'Android';
  } else if (/iPhone|iPad|iOS/i.test(userAgent)) {
    sistema = 'iOS';
  } else if (/Mac/i.test(userAgent)) {
    sistema = 'macOS';
  } else if (/Linux/i.test(userAgent)) {
    sistema = 'Linux';
  }

  return `${dispositivo} - ${sistema}`;
}

// Carrega dados do usuário logado
const dados = JSON.parse(localStorage.getItem('dadosUsuario'));

if (!dados || !dados.nome || !dados.matricula || !dados.telefone || !dados.email || !dados.senha) {
  alert('Dados de usuário inválidos. Faça login novamente.');
  localStorage.removeItem('usuarioLogado');
  localStorage.removeItem('dadosUsuario');
  location.replace('login.html');
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
  document.getElementById('infoNome').textContent = `📌 Nome: ${dados.nome}`;
  document.getElementById('infoMatricula').textContent = `📌 Matrícula: ${dados.matricula}`;
  document.getElementById('infoTelefone').textContent = `📞 Telefone: ${dados.telefone}`;
  document.getElementById('infoEmail').textContent = `📧 E-mail: ${dados.email}`;
  document.getElementById('infoDispositivo').textContent = `💻 Dispositivo: ${dados.dispositivo || identificarDispositivo(navigator.userAgent)}`;
});

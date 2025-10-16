if (localStorage.getItem('usuarioLogado') !== 'true') {
  window.location.href = 'login.html';
}

const dados = JSON.parse(localStorage.getItem('dadosUsuario')) || {
  matricula: '2815',
  telefone: '(62) 98250-2200',
  email: 'jefersonalves.ti@gmail.com',
  senha: '123456'
};

document.getElementById('infoMatricula').textContent = `📌 Matrícula: ${dados.matricula}`;
document.getElementById('infoTelefone').textContent = `📞 Telefone: ${dados.telefone}`;
document.getElementById('infoEmail').textContent = `📧 E-mail: ${dados.email}`;

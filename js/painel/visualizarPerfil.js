function mostrarDados() {
  const dados = JSON.parse(localStorage.getItem('dadosUsuario'));
  alert(`Seus dados atuais:\n\nNome: ${dados.nome}\nMatrícula: ${dados.matricula}\nTelefone: ${dados.telefone}\nE-mail: ${dados.email}\nSenha: ${dados.senha}`);
}

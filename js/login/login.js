
    function mostrarFormularioCadastro() {
      const form = document.getElementById('formCadastro');
      const botao = document.getElementById('btnCadastrar');
      form.style.display = form.style.display === 'none' ? 'block' : 'none';
      botao.textContent = form.style.display === 'none' ? 'Cadastrar' : 'Fechar';
    }

    function toggleSenha() {
      const senhaInput = document.getElementById('senha');
      const toggleIcon = document.getElementById('toggleIcon');
      senhaInput.type = senhaInput.type === 'password' ? 'text' : 'password';
      toggleIcon.textContent = senhaInput.type === 'password' ? '👁️' : '🙈';
    }

    function toggleSenhaCadastro() {
      const senhaInput = document.getElementById('cadSenha');
      const toggleIcon = document.getElementById('toggleIconCadastro');
      senhaInput.type = senhaInput.type === 'password' ? 'text' : 'password';
      toggleIcon.textContent = senhaInput.type === 'password' ? '👁️' : '🙈';
    }

    function aplicarMascaraTelefone(id) {
      document.getElementById(id).addEventListener('input', function (e) {
        let input = e.target.value.replace(/\D/g, '').slice(0, 11);
        let formatted = '';

        if (input.length > 0) {
          formatted += '(' + input.substring(0, 2);
        }
        if (input.length >= 3) {
          formatted += ') ';
          if (input.length >= 7) {
            formatted += input.substring(2, 7) + '-' + input.substring(7, 11);
          } else {
            formatted += input.substring(2);
          }
        }

        e.target.value = formatted;
      });
    }

    function telefoneValido(telefone) {
      const regex = /^\(\d{2}\) \d{5}-\d{4}$/;
      return regex.test(telefone);
    }

    aplicarMascaraTelefone('telefone');
    aplicarMascaraTelefone('cadTelefone');

    document.getElementById('formCadastro').addEventListener('submit', function (e) {
      e.preventDefault();

      const nome = document.getElementById('cadNome').value.trim();
      const matricula = document.getElementById('cadMatricula').value.trim();
      const telefone = document.getElementById('cadTelefone').value.trim();
      const email = document.getElementById('cadEmail').value.trim();
      const senha = document.getElementById('cadSenha').value.trim();
      const mensagem = document.getElementById('mensagemCadastro');

      if (!nome || !matricula || !telefone || !email || !senha) {
        mensagem.textContent = 'Todos os campos são obrigatórios.';
        mensagem.style.color = 'red';
        return;
      }

      if (!telefoneValido(telefone)) {
        mensagem.textContent = 'Telefone inválido. Use o formato (99) 99999-9999.';
        mensagem.style.color = 'red';
        return;
      }

      const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      const duplicado = usuarios.find(u => u.matricula === matricula || u.email === email);

      if (duplicado) {
        mensagem.textContent = 'Usuário já cadastrado.';
        mensagem.style.color = 'red';
        return;
      }

      const novoUsuario = { nome, matricula, telefone, email, senha };
      usuarios.push(novoUsuario);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));

      mensagem.textContent = 'Cadastro realizado com sucesso!';
      mensagem.style.color = 'green';
      document.getElementById('formCadastro').reset();
      mostrarFormularioCadastro();
    });

    document.getElementById('loginForm').addEventListener('submit', function (e) {
      e.preventDefault();

      const nome = document.getElementById('nome').value.trim();
      const matricula = document.getElementById('matricula').value.trim();
      const telefone = document.getElementById('telefone').value.trim();
      const email = document.getElementById('email').value.trim();
      const senha = document.getElementById('senha').value.trim();
      const mensagem = document.getElementById('mensagem');

      if (!nome || !matricula || !telefone || !email || !senha) {
        mensagem.textContent = 'Todos os campos são obrigatórios.';
        mensagem.style.color = 'red';
        return;
      }

      if (!telefoneValido(telefone)) {
        mensagem.textContent = 'Telefone inválido. Use o formato (99) 99999-9999.';
        mensagem.style.color = 'red';
        return;
      }

      const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      const usuarioValido = usuarios.find(user =>
        user.nome === nome &&
        user.matricula === matricula &&
        user.telefone === telefone &&
        user.email === email &&
        user.senha === senha
      );

      if (usuarioValido) {
        localStorage.setItem('usuarioLogado', 'true');
        localStorage.setItem('dadosUsuario', JSON.stringify(usuarioValido));
        mensagem.textContent = 'Login bem-sucedido!';
        mensagem.style.color = 'green';
        setTimeout(() => {
          location.replace('painel.html');
        }, 1500);
      } else {
        mensagem.textContent = 'Credenciais inválidas.';
        mensagem.style.color = 'red';
      }
    });
// Funções auxiliares (máscara, validação, identificação)
// Alterna exibição do formulário de cadastro
function mostrarFormularioCadastro() {
    const form = document.getElementById('formCadastro');
    const botao = document.getElementById('btnCadastrar');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    botao.textContent = form.style.display === 'none' ? 'Cadastrar' : 'Fechar';
}

// Alterna visibilidade da senha
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

// Aplica máscara de telefone
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

// Valida formato do telefone
function telefoneValido(telefone) {
    const regex = /^\(\d{2}\) \d{5}-\d{4}$/;
    return regex.test(telefone);
}

// Retorna tipo de dispositivo e sistema operacional
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

// Inicializa máscaras
aplicarMascaraTelefone('telefone');
aplicarMascaraTelefone('cadTelefone');

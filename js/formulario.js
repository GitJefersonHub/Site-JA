const supabaseUrl = 'https://obnecttnvjzjnsclqxky.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ibmVjdHRudmp6am5zY2xxeGt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1MjIwMTQsImV4cCI6MjA1NzA5ODAxNH0.4OF_suBrFG-8MQp1y2PMyYmq7EfWWs3v-WUclwwYygw';
    
    document.getElementById('form-contato').addEventListener('submit', async function (event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const telefone = document.getElementById('telefone').value;
        const mensagem = document.getElementById('mensagem').value;
        
        try {
            const response = await fetch(`${supabaseUrl}/rest/v1/contatos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`,
                },
                body: JSON.stringify({ nome, email, telefone, mensagem }),
            });

            if (response.ok) {
                alert('Informações salvas com sucesso!');
                document.querySelector('.btn-enviar').style.display = 'none'; // Esconde o botão Enviar
                document.querySelector('.nav-buttons').style.display = 'block'; // Mostra os botões de navegação
                document.getElementById('form-contato').reset(); // Limpa o formulário
                window.location.href = 'tec.html'; // Redireciona para .html
            } else {
                throw new Error('Erro ao salvar as informações.');
            }
        } catch (error) {
            alert('Erro ao salvar as informações: Site em manutenção.');
        }
    });

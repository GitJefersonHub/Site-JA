const weatherApiKey = CONFIG.WEATHER_API_KEY;
const exchangeRateApiKey = CONFIG.EXCHANGE_RATE_API_KEY;

async function getWeather(latitude, longitude) {
    try {
        // URLs das APIs de tempo atual e previsão
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherApiKey}&lang=pt_br`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherApiKey}&lang=pt_br`;

        // Faz as chamadas assíncronas em paralelo
        const [weatherRes, forecastRes, selicRate, dollarRate, euroRate] = await Promise.all([
            fetch(weatherUrl).then(res => res.json()), // Dados do tempo atual
            fetch(forecastUrl).then(res => res.json()), // Dados da previsão
            getSelicRate(), // Taxa SELIC
            getExchangeRate('USD'), // Cotação do dólar
            getExchangeRate('EUR') // Cotação do euro
        ]);

        const temperature = weatherRes.main.temp.toFixed(1); // Temperatura formatada
        const description = weatherRes.weather[0].description; // Descrição do tempo
        const city = weatherRes.name; // Nome da cidade

        // Filtra previsões do meio-dia e cria HTML
        const forecastHtml = forecastRes.list
            .filter((item, index) => item.dt_txt.includes("12:00:00")) // Apenas meio-dia
            .slice(0, 2) // Apenas próximos 2 dias
            .map(day => {
                const date = new Date(day.dt * 1000); // Converte data UNIX
                const dayOfWeek = date.toLocaleDateString('pt-BR', { weekday: 'long' }); // Nome do dia
                const temp = day.main.temp.toFixed(1); // Temperatura do dia
                const desc = day.weather[0].description; // Descrição do tempo
                return `${dayOfWeek}: ${temp}°C / ${desc}`; // Linha da previsão
            }).join('<br>'); // Quebra de linha no HTML

        // Exibe as informações no elemento com id 'weather'
        document.getElementById('weather').innerHTML = `
            ${city}, ${new Date().toLocaleDateString('pt-BR')}<br>
            hoje: ${temperature}°C / ${description}<br>
            ${forecastHtml}<br>
            * Taxa SELIC: ${selicRate.toFixed(2)}%<br>
            * Dólar: R$ ${dollarRate.toFixed(2)}<br>
            * Euro: R$ ${euroRate.toFixed(2)}`;
    } catch (error) {
        console.error('Erro ao obter dados:', error); // Exibe erro no console
        document.getElementById('weather').innerHTML = 'Erro ao carregar informações.'; // Mensagem de erro na tela
    }
}

// Função para buscar taxa de câmbio de uma moeda
async function getExchangeRate(currency) {
    try {
        const url = `https://v6.exchangerate-api.com/v6/${exchangeRateApiKey}/latest/${currency}`; // Monta URL
        const response = await fetch(url); // Faz requisição
        const data = await response.json(); // Converte para JSON
        return data.conversion_rates.BRL; // Retorna valor para BRL
    } catch (error) {
        console.error(`Erro ao obter a cotação de ${currency}:`, error); // Mostra erro
        return NaN; // Retorna valor inválido
    }
}

// Função para buscar taxa SELIC
async function getSelicRate() {
    try {
        const response = await fetch('https://brasilapi.com.br/api/taxas/v1/selic'); // Chamada API
        const data = await response.json(); // Converte para JSON
        return parseFloat(data.valor); // Retorna taxa numérica
    } catch (error) {
        console.error('Erro ao obter a taxa SELIC:', error); // Mostra erro
        return NaN; // Valor inválido
    }
}

// Função para obter localização do usuário
function getLocation() {
    if (navigator.geolocation) { // Verifica suporte
        navigator.geolocation.getCurrentPosition(position => {
            // Chama função de clima com coordenadas
            getWeather(position.coords.latitude, position.coords.longitude);
        }, () => {
            // Caso erro ao acessar localização
            document.getElementById('weather').innerHTML = 'Previsão do tempo atual e finanças se a localização do dispositivo for acessada.';
        });
    } else {
        // Geolocalização não suportada
        document.getElementById('weather').innerHTML = 'Geolocalização não suportada.';
    }
}

// Executa ao carregar a página
window.onload = getLocation;

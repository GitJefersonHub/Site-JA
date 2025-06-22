const weatherApiKey = 'b8e1ca208ba37b685082aa9f5ab4d284';
const exchangeRateApiKey = '5a6fefb706ee7746e76d8c16';

async function getWeather(latitude, longitude) {
    try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherApiKey}&lang=pt_br`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherApiKey}&lang=pt_br`;

        const [weatherRes, forecastRes, selicRate, dollarRate, euroRate] = await Promise.all([
            fetch(weatherUrl).then(res => res.json()),
            fetch(forecastUrl).then(res => res.json()),
            getSelicRate(),
            getExchangeRate('USD'),
            getExchangeRate('EUR')
        ]);

        const temperature = weatherRes.main.temp.toFixed(1);
        const description = weatherRes.weather[0].description;
        const city = weatherRes.name;

        const forecastHtml = forecastRes.list
            .filter((item, index) => item.dt_txt.includes("12:00:00")) // previsões do meio-dia
            .slice(0, 2)
            .map(day => {
                const date = new Date(day.dt * 1000);
                const dayOfWeek = date.toLocaleDateString('pt-BR', { weekday: 'long' });
                const temp = day.main.temp.toFixed(1);
                const desc = day.weather[0].description;
                return `${dayOfWeek}: ${temp}°C / ${desc}`;
            }).join('<br>');

        document.getElementById('weather').innerHTML = `
            ${city}, ${new Date().toLocaleDateString('pt-BR')}<br>
            hoje: ${temperature}°C / ${description}<br>
            ${forecastHtml}<br>
            * Taxa SELIC: ${selicRate.toFixed(2)}%<br>
            * Dólar: R$ ${dollarRate.toFixed(2)}<br>
            * Euro: R$ ${euroRate.toFixed(2)}`;
    } catch (error) {
        console.error('Erro ao obter dados:', error);
        document.getElementById('weather').innerHTML = 'Erro ao carregar informações.';
    }
}

async function getExchangeRate(currency) {
    try {
        const url = `https://v6.exchangerate-api.com/v6/${exchangeRateApiKey}/latest/${currency}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.conversion_rates.BRL;
    } catch (error) {
        console.error(`Erro ao obter a cotação de ${currency}:`, error);
        return NaN;
    }
}

async function getSelicRate() {
    try {
        const response = await fetch('https://brasilapi.com.br/api/taxas/v1/selic');
        const data = await response.json();
        return parseFloat(data.valor);
    } catch (error) {
        console.error('Erro ao obter a taxa SELIC:', error);
        return NaN;
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            getWeather(position.coords.latitude, position.coords.longitude);
        }, () => {
            document.getElementById('weather').innerHTML = 'Previsão do tempo atual e finanças se a localização do dispositivo for acessada.';
        });
    } else {
        document.getElementById('weather').innerHTML = 'Geolocalização não suportada.';
    }
}

window.onload = getLocation;

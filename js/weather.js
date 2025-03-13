const weatherApiKey = 'b8e1ca208ba37b685082aa9f5ab4d284'; // Chave de API do OpenWeatherMap
            const exchangeRateApiKey = '5a6fefb706ee7746e76d8c16'; // Chave de API do ExchangeRate-API

            function getWeather(latitude, longitude) {
                const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherApiKey}&lang=pt_br`;
                const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherApiKey}&lang=pt_br`;

                fetch(weatherUrl)
                    .then(response => response.json())
                    .then(data => {
                        const weatherDiv = document.getElementById('weather');
                        const temperature = data.main.temp.toFixed(1);
                        const description = data.weather[0].description;
                        const city = data.name;

                        Promise.all([getExchangeRate('USD'), getExchangeRate('EUR')]).then(([dollarRate, euroRate]) => {
                            const dollarRateFormatted = dollarRate.toFixed(2);
                            const euroRateFormatted = euroRate.toFixed(2);

                            fetch(forecastUrl)
                                .then(response => response.json())
                                .then(forecastData => {
                                    const nextTwoDays = forecastData.list.filter((item, index) => index % 8 === 0).slice(1, 3);
                                    const forecastHtml = nextTwoDays.map(day => {
                                        const date = new Date(day.dt * 1000);
                                        const dayOfWeek = date.toLocaleDateString('pt-BR', { weekday: 'long' });
                                        const temp = day.main.temp.toFixed(1);
                                        const desc = day.weather[0].description;
                                        return `${dayOfWeek}: ${temp}°C / ${desc}`;
                                    }).join('<br>');

                                    weatherDiv.innerHTML = `
                                        ${city}, ${new Date().toLocaleDateString('pt-BR')}<br>
                                        Hoje: ${temperature}°C / ${description}<br>
                                        ${forecastHtml}<br><br>
                                        Dólar: R$ ${dollarRateFormatted}<br>
                                        Euro: R$ ${euroRateFormatted}`;
                                })
                                .catch(error => {
                                    console.error('Erro ao obter a previsão do tempo:', error);
                                });
                        })
                        .catch(error => {
                            console.error('Erro ao obter as cotações:', error);
                        });
                    })
                    .catch(error => {
                        console.error('Erro ao obter dados meteorológicos:', error);
                    });
            }

            function getExchangeRate(currency) {
                const exchangeRateUrl = `https://v6.exchangerate-api.com/v6/${exchangeRateApiKey}/latest/${currency}`;

                return fetch(exchangeRateUrl)
                    .then(response => response.json())
                    .then(data => data.conversion_rates.BRL)
                    .catch(error => {
                        console.error(`Erro ao obter a cotação de ${currency}:`, error);
                        return 'N/A';
                    });
            }

            function getLocation() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(position => {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;
                        getWeather(latitude, longitude);
                    });
                } else {
                    document.getElementById('weather').innerHTML = 'Geolocalização não suportada pelo seu navegador.';
                }
            }

            window.onload = getLocation;
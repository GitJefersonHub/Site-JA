/*Planilha de entrada*/
const dadosCadastrados = [];

document.getElementById('entrada').addEventListener('input', function () {
  let valor = this.value.replace(/\D/g, '');
  valor = (parseInt(valor, 10) / 100).toFixed(2);
  this.value = 'R$ ' + valor.replace('.', ',');
});

document.querySelector('.cadastrar button').addEventListener('click', function () {
  const calendario = document.getElementById('calendario').value;
  const cnae = document.getElementById('cnae').value.trim();
  const servicos = document.getElementById('servicos').value.trim();
  const itens = document.getElementById('itens').value.trim();
  const entrada = document.getElementById('entrada').value.trim();

  if (!calendario || !cnae || !servicos || !itens|| !entrada ) {
    alert('Preencha todos os campos');
    return;
  }

  const [ano, mes, dia] = calendario.split('-').map(Number);
  const dataObj = new Date(ano, mes - 1, dia);
  const diaFormatado = String(dia).padStart(2, '0');
  const mesFormatado = String(mes).padStart(2, '0');
  const anoFormatado = String(ano).slice(-2);
  const periodo = `${diaFormatado}/${mesFormatado}/${anoFormatado}`;


  dadosCadastrados.push({
    periodo,
    dataObj,
    cnae,
    servicos,
    itens,
    entrada
  });

  // Ordena os dados por data
  dadosCadastrados.sort((a, b) => a.dataObj - b.dataObj);

  const tabela = document.getElementById('tabelaDados').querySelector('tbody');
  tabela.innerHTML = '';

  // Agrupa os dados por ano
  const dadosPorAno = {};
  dadosCadastrados.forEach(dado => {
    const ano = dado.periodo.split('/')[2];
    if (!dadosPorAno[ano]) {
      dadosPorAno[ano] = [];
    }
    dadosPorAno[ano].push(dado);
  });

  // Ordena os anos em ordem crescente
  const anosOrdenados = Object.keys(dadosPorAno).sort((a, b) => parseInt(a) - parseInt(b));

  anosOrdenados.forEach(ano => {
    let totalEntrada = 0;
    let totalItens = 0;

    dadosPorAno[ano].forEach(dado => {
      const linha = tabela.insertRow();
      linha.insertCell().textContent = dado.periodo;
      linha.insertCell().textContent = dado.cnae;
      linha.insertCell().textContent = dado.servicos;
      linha.insertCell().textContent = dado.itens;
      linha.insertCell().textContent = dado.entrada;

      const valorEntrada = parseFloat(dado.entrada.replace('R$', '').replace(',', '.').trim()) || 0;
      const valorItens = parseInt(dado.itens, 10) || 0;
      totalEntrada += valorEntrada;
      totalItens += valorItens;
    });

    const linhaTotal = tabela.insertRow();

    linhaTotal.insertCell().textContent = `Total 20${ano}`;
    linhaTotal.insertCell().textContent = '';
    linhaTotal.insertCell().textContent = '';
    linhaTotal.insertCell().textContent = totalItens;
    linhaTotal.insertCell().textContent = `R$ ${totalEntrada.toFixed(2).replace('.', ',')}`;
    linhaTotal.style.fontWeight = 'bold';
    linhaTotal.style.backgroundColor = '#f0f0f0';
  });

  // Limpa os campos
  document.getElementById('calendario').value = '';
  document.getElementById('cnae').value = '';
  document.getElementById('servicos').value = '';
  document.getElementById('itens').value = '';
  document.getElementById('entrada').value = '';
});

document.querySelectorAll('button').forEach(btn => {
  if (!btn.classList.contains('amarelo-claro')) {
    btn.addEventListener('click', () => {
      alert(`Você clicou em "${btn.textContent}"`);
    });
  }

  document.getElementById("cnae").addEventListener("change", function () {
  const servicos = document.getElementById("servicos");
  const selectedCnae = this.value;

  servicos.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Serviço";
  servicos.appendChild(defaultOption);

  const optionsMap = {
    "motorista App": ["corridas", "entregas"],
    "serigrafia": ["impressão", "cópia"],
    "vendas": ["alimentos", "produtos"],
    "Outros": ["ps"]
  };

  if (optionsMap[selectedCnae]) {
    optionsMap[selectedCnae].forEach(servico => {
      const option = document.createElement("option");
      option.value = servico;
      option.textContent = servico.charAt(0).toUpperCase() + servico.slice(1);
      servicos.appendChild(option);
    });
  }
});

});

<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Verifica o método da requisição
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["message" => "Método não permitido"]);
    exit;
}

// Configurações do banco de dados
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "site-jef"; // Nome do banco de dados

// Cria a conexão com o banco de dados
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica a conexão
if ($conn->connect_error) {
    die(json_encode(["message" => "Falha na conexão: " . $conn->connect_error]));
}

// Coleta os dados do formulário
$nome = htmlspecialchars($_POST['nome']);
$email = htmlspecialchars($_POST['email']);
$telefone = htmlspecialchars($_POST['telefone']);
$mensagem = htmlspecialchars($_POST['mensagem']);

// Define o fuso horário para Brasília
date_default_timezone_set('America/Sao_Paulo');
$data_formatada = date("d/m/Y H:i:s");

// Valida o campo telefone
if (!preg_match('/^[0-9]{10,15}$/', $telefone)) {
    echo json_encode(["message" => "Telefone inválido. Por favor, insira apenas números, com 10 a 15 dígitos."]);
    exit;
}

// Prepara a consulta SQL para inserir os dados
$sql = "INSERT INTO contatos (nome, email, telefone, mensagem, data_formatada) VALUES ('$nome', '$email', '$telefone', '$mensagem', '$data_formatada')";

// Executa a consulta SQL
if ($conn->query($sql) === TRUE) {
    error_log("Dados cadastrados com sucesso! Nome: $nome, Email: $email, Telefone: $telefone, Mensagem: $mensagem, Data: $data_formatada");
    echo json_encode(["message" => "Dados cadastrados com sucesso! Data: $data_formatada"]);
} else {
    error_log("Erro ao cadastrar dados: " . $conn->error);
    echo json_encode(["message" => "Erro: " . $conn->error]);
}

// Fecha a conexão com o banco de dados
$conn->close();
?>


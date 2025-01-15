<?php
// Conectar a la base de datos
$servername = "localhost";
$username = "ExpertItSupportAdmin";
$password = "ExpertItSupport";
$dbname = "expertitsupport";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Obtener el correo electrónico del formulario
$email = $_POST['email'];

// Insertar el correo electrónico en la tabla users
$sql = "INSERT INTO users (email) VALUES ('$email')";

if ($conn->query($sql) === TRUE) {
    echo "Usuario añadido a base de datos SQL tabla users\n";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error . "\n";
}

// Cerrar conexión
$conn->close();
?>
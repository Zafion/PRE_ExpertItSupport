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

// Obtener la fecha y hora actual
$sign_date = date('Y-m-d');

// Insertar el correo electrónico y la fecha de registro en la tabla users
$sql = "INSERT INTO users (email, sign_date) VALUES ('$email', '$sign_date')";

//si se inserta correctamente muestra un mensaje de éxito y si no muestra un mensaje de error
if ($conn->query($sql) === TRUE) { //
    echo "Usuario añadido a base de datos SQL tabla users\n";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error . "\n";
}

// Cerrar conexión
$conn->close();
?>
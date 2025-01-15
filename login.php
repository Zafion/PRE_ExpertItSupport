


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

// Obtener el user_id del usuario
$sql = "SELECT user_id FROM users WHERE email='$email'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $user_id = $row['user_id'];

    // Insertar en la tabla login_history
    $login_date = date('Y-m-d');
    $login_time = date('H:i:s');
    $sql = "INSERT INTO login_history (user_id, login_date, login_time) VALUES ('$user_id', '$login_date', '$login_time')";

    if ($conn->query($sql) === TRUE) {
        echo "Login history registrado correctamente en base de datos SQL, tabla login_history\n";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error . "\n";
    }

    // Actualizar o insertar en la tabla last_login
    $sql = "INSERT INTO last_login (user_id, last_login_date, last_login_time) VALUES ('$user_id', '$login_date', '$login_time')
            ON DUPLICATE KEY UPDATE last_login_date='$login_date', last_login_time='$login_time'";

    if ($conn->query($sql) === TRUE) {
        echo "Last login actualizado correctamente en base de datos SQL tabla last_login\n";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error . "\n";
    }
} else {
    echo "No user found with that email";
}

// Cerrar conexión
$conn->close();
?>
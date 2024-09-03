<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require '../../vendor/autoload.php'; // Asegúrate de tener PHPMailer instalado via Composer

header('Content-Type: application/json');

$response = ['success' => false, 'message' => ''];

try {
    $mail = new PHPMailer(true);

    //Server settings
    $mail->isSMTP();
    $mail->Host       = 'smtp.hostinger.com'; // Reemplaza con el servidor SMTP de tu hosting
    $mail->SMTPAuth   = true;
    $mail->Username   = 'web@telukespares.com'; // Reemplaza con tu correo
    $mail->Password   = '!q5z^8m=F8'; // Reemplaza con tu contraseña
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // O PHPMailer::ENCRYPTION_SMTPS si es requerido
    $mail->Port       = 465; // O el puerto que te indique tu proveedor

    //Recipients
    $mail->setFrom('web@telukespares.com', 'Teluke Spares');
    $mail->addAddress('blucanus@gmail.com'); // Añade el destinatario

    // Content
    $mail->isHTML(true);
    $mail->Subject = 'Nuevo mensaje de formulario de contacto';
    
    $body = "Nombre: " . $_POST['name'] . " " . $_POST['lastname'] . "<br>";
    $body .= "Teléfono: " . $_POST['phone'] . "<br>";
    $body .= "Email: " . $_POST['email'] . "<br>";
    $body .= "Modelo de máquina: " . $_POST['machinemodel'] . "<br>";
    $body .= "Número de parte: " . $_POST['partnumber'] . "<br>";
    $body .= "Mensaje: " . $_POST['message'];

    $mail->Body = $body;

    $mail->send();
    $response['success'] = true;
    $response['message'] = 'Mensaje enviado con éxito';
} catch (Exception $e) {
    $response['message'] = "El mensaje no pudo ser enviado. Error: {$mail->ErrorInfo}";
}

echo json_encode($response);
fwrite(STDOUT, "Este es un mensaje de error o depuración\n");
?>
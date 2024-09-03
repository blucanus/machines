<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../../vendor/autoload.php'; // Asegúrate de que la ruta es correcta

// Verifica si el formulario ha sido enviado
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Captura los datos del formulario
    $name = htmlspecialchars(trim($_POST['name']));
    $lastname = htmlspecialchars(trim($_POST['lastname']));
    $phone = htmlspecialchars(trim($_POST['phone']));
    $email = htmlspecialchars(trim($_POST['email']));
    $machinemodel = htmlspecialchars(trim($_POST['machinemodel']));
    $partnumber = htmlspecialchars(trim($_POST['partnumber']));
    $message = htmlspecialchars(trim($_POST['message']));

    // Instancia PHPMailer
    $mail = new PHPMailer(true);

    try {
        // Configuración del servidor de correo
        $mail->isSMTP();
        $mail->Host = 'smtp.hostinger.com'; // Configura el host SMTP (cambia esto por tu servidor SMTP)
        $mail->SMTPAuth = true;
        $mail->Username = 'web@telukespares.com'; // Tu correo
        $mail->Password = '!q5z^8m=F8'; // Tu contraseña
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465; // Puerto SMTP (puede variar según el servidor)

        // Remitente y destinatarios
        $mail->setFrom($email, $name);
        $mail->addAddress('blucanus@gmail.com'); // Cambia esto por la dirección de correo a la que quieres enviar el mensaje

        // Contenido del correo
        $mail->isHTML(true);
        $mail->Subject = 'New message from website contact form';
        $mail->Body = "
            <h2>Contact Form Submission</h2>
            <p><strong>Name:</strong> $name</p>
            <p><strong>Last Name:</strong> $lastname</p>
            <p><strong>Phone:</strong> $phone</p>
            <p><strong>Email:</strong> $email</p>
            <p><strong>Machine Model:</strong> $machinemodel</p>
            <p><strong>Part Number:</strong> $partnumber</p>
            <p><strong>Message:</strong><br>$message</p>
        ";

        // Enviar el correo
        $mail->send();

        // Mostrar mensaje de éxito
        echo "<script>
            document.getElementById('successContainer').style.display = 'block';
            document.getElementById('successContainer').innerText = 'Message sent successfully!';
        </script>";
    } catch (Exception $e) {
        // Mostrar mensaje de error
        echo "<script>
            document.getElementById('errorContainer').style.display = 'block';
            document.getElementById('errorContainer').innerText = 'Message could not be sent. Mailer Error: {$mail->ErrorInfo}';
        </script>";
    }
}
?>
<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../../vendor/autoload.php';

header('Content-Type: application/json');

$response = ['success' => false, 'message' => 'No se pudo procesar la solicitud'];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try {
        $mail = new PHPMailer(true);

        //Server settings
        $mail->isSMTP();
        $mail->Host       = 'smtp.hostinger.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'web@telukespares.com';
        $mail->Password   = '!q5z^8m=F8';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // Cambiado a SMTPS para el puerto 465
        $mail->Port       = 465;

        //Recipients
        $mail->setFrom('web@telukespares.com', 'Teluke Spares');
        $mail->addAddress('info@telukespares.com');

        // Sanitize and validate input
        $part_number = filter_input(INPUT_POST, 'part-number', FILTER_SANITIZE_STRING);
        $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
        $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
        $message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);

        if (!$email) {
            throw new Exception('Dirección de correo electrónico inválida');
        }

        $mail->isHTML(true);
        $mail->Subject = "New Request from web: $part_number";
        
        $body = "
         <div style='max-width: 600px;'>
        <h3 style='text-align: center; background: #c97f26; color: #fff;padding: 10px;'>New Request from web</h3>
            <p style='padding: 5px 30px;'><strong>Part Number:</strong> $part_number</p>
            <p style='padding: 5px 30px;'><strong>Name:</strong> $name</p>
            <p style='padding: 5px 30px;'><strong>Email:</strong> $email</p>
            <p style='padding: 5px 30px;'><strong>Message:</strong><br>$message</p>
            <h5 style='text-align: center;border-top: 1px solid #c97f26;padding: 10px;'>Teluke Spares</h5>
            </div>
        ";

        $mail->Body = $body;

        $mail->send();
        $response['success'] = true;
        $response['message'] = 'Mensaje enviado con éxito';

    } catch (Exception $e) {
        $response['message'] = "El mensaje no pudo ser enviado. Error: {$e->getMessage()}";
    }
} else {
    $response['message'] = "Método de solicitud no válido";
}

echo json_encode([
    'success' => true, // or false
    'message' => 'Great. Your message was sending.'
]);
?>
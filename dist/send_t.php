<?php
require_once __DIR__.'/vendor/autoload.php';


use PHPMailer\PHPMailer\PHPMailer;

if(strlen($_POST['mail'])>5 and strlen($_POST['ms'])>4 and strlen($_POST['name'])>1 and strlen($_POST['phone'])>4){
error_reporting(E_ALL);
ini_set("display_errors", 1);

    function send_email($to,$theme,$message){   
        $mail = new PHPMailer(true); // Passing `true` enables exceptions
        try {
            //Server settings
            $mail->SMTPDebug = 0; // Enable verbose debug output
            $mail->isSMTP(); // Set mailer to use SMTP
            $mail->CharSet = 'UTF-8';
            $mail->Host = 'smtp.mail.ru'; // Specify main and backup SMTP servers
            $mail->SMTPAuth = true; // Enable SMTP authentication
            $mail->Username = 'send.mail.01@mail.ru'; // SMTP username
            $mail->Password = 'lololo228Aa'; // SMTP password
            $mail->SMTPSecure = 'tls'; // Enable TLS encryption, `ssl` also accepted
            $mail->Port = 587; // TCP port to connect to
            $mail->SMTPOptions = array(
                'ssl' => array(
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true
                )
            );  
            //Recipients
            $mail->setFrom('send.mail.01@mail.ru', 'Customer order Corplex');
            $mail->addAddress('uzi.no.uzi.web@gmail.com', 'Corplex.io'); // Add a recipient
            
            $mail->isHTML(true); // Set email format to HTML
            $mail->Subject = 'Customer order Corplex';
            $mail->Body = 'Name: '.$_POST['name'].'<br /> E-mail: '.$_POST['mail'].'<br /> Phone: '.$_POST['phone'].'<br /> Message: '.$_POST['ms'];
            $mail->AltBody = 'Application';
            $mail->send();
            echo '+';
        } catch (Exception $e) {
            echo 'Message could not be sent. Mailer Error: ', $mail->ErrorInfo;
        }
                    

        
    }
    
    if(send_email('uzi.no.uzi.web@gmail.com','Заказ', 'Имя:'.$_POST['name'].'. <br >Cообщение: '.$_POST['ms'].'. <br> Почта: '.$_POST['mail'])){
        echo "+";
    }
}
?>
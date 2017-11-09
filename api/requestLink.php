<?php

$actual_link = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

require_once('log.php');
require_once('credentials.php');


require 'dbConfig.php';

require_once('./PHPMailer/PHPMailerAutoload.php');

function sendEmail($to, $token, $name){
    global $mailUsername, $mailPassword; // Nämä on pakko olla
    $subject = "Kirjautumislinkki tarkkailuraporttisivulle";
    $body = "Hei!\r\nTässä on kirjautumislinkkisi tarkkailuraporttisivulle:\r\nhttp://www.lentopalloerotuomarit.fi/tuomaritarkkailu/?token=" . $token . "\r\n\r\nÄlä vastaa tähän viestiin, vaan ongelmatapauksissa ota yhteyttä jostrovs@gmail.com.\r\n-Jori\r\n";
     
    $mail = new PHPMailer();
    
    $mail->IsSMTP();                       // telling the class to use SMTP
     
    $mail->SMTPDebug = 0;                  
    // 0 = no output, 1 = errors and messages, 2 = messages only.
     
    $mail->SMTPAuth = true;                // enable SMTP authentication 
    $mail->SMTPSecure = "tls";              // sets the prefix to the servier
    $mail->Host = "mail.zoner.fi";        // sets Gmail as the SMTP server
    $mail->Port = 587;                     // set the SMTP port for the GMAIL 
     
    $mail->Username = $mailUsername;
    $mail->Password = $mailPassword;
 
    $mail->CharSet = 'utf-8';
    $mail->SetFrom ('tarkkailu@lentopalloerotuomarit.fi', 'Jori');
    $mail->AddBCC ( 'jostrovs@gmail.com', 'Jori'); 
    $mail->Subject = $subject;
    $mail->ContentType = 'text/plain'; 
    $mail->IsHTML(false);
     
    $mail->Body = $body; 
    // you may also use $mail->Body = file_get_contents('your_mail_template.html');
     
    $mail->AddAddress ($to, $name);     
    // you may also use this format $mail->AddAddress ($recipient);
     
    if(!$mail->Send()) 
    {
        $error_message = "Mailer Error: " . $mail->ErrorInfo;
        echo $error_message;        
    } else 
    {
        $error_message = "Successfully sent!";
    } 
    return $error_message;
}

$email  = $_GET["email"];
$email = strtolower($email);

jos_log("Linkkiä pyydetty osoitteelle: " . $email, JOS_LOG_IMPORTANT);

$sql = "SELECT token, email, etunimi, sukunimi FROM tuomari WHERE email='" . $email . "'";
$result = $mysqli->query($sql);

$token = "0";
$nimi = "Vastaanottaja";
while($row = $result->fetch_assoc()){
    $token = $row['token'];
    $etunimi = $row['etunimi'];
    $sukunimi = $row['sukunimi'];
    $nimi = $etunimi . " " . $sukunimi;
}

if($token != "0"){
    sendEmail($email, $token, $nimi);
    $data = "1";
    
    $enc = json_encode($data, JSON_UNESCAPED_UNICODE);
    if(!$enc) echo "Enkoodaus feilasi, ";
    else echo $enc;
    
} else {
    $data["error"] = 1;
    $data["msg"] = "Käyttäjää ei löydy.";
    $enc = json_encode($data, JSON_UNESCAPED_UNICODE);
    if(!$enc) echo "Enkoodaus feilasi, ";
    else echo $enc;
}

?>
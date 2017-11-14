<?php

    $actual_link = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

    require_once('credentials.php');
    require_once('log.php');
    require_once('dbConfig.php');

    require_once('dbAuthenticatePost.php');
    require_once('./PHPMailer/PHPMailerAutoload.php');
    
    function obj($key){
        global $obj, $mysqli;
        $item = $obj[$key];
        return $mysqli->real_escape_string($item);
    }

    function valueRow($no){
        global $report_id, $debug;
        $key = "aihe_".$no;
        $id = obj($key."_id");
        $arvosana = obj($key."_arvosana");
        $huom = obj($key."_huom");

        return "(".$id.", ".$arvosana.", ".$report_id.", '".$huom."')";
    }

    function emailNotify($tark, $ottelu, $to, $token, $nimi){
        global $mailUsername, $mailPassword; // Nämä on pakko olla

        //$to = "jori.ostrovskij@gmail.com";
        
        $subject = "Uusi tarkkailuraportti";
        $body = "Hei!\r\n\r\n" .
                 $tark . " on lisännyt tarkkailuraportin ottelusta " . $ottelu . ".\r\n" . 
                 "Tässä on vielä kirjautumislinkkisi:\r\n" .
                 "http://www.lentopalloerotuomarit.fi/tuomaritarkkailu/?token=" . $token . 
                 "\r\n\r\nÄlä vastaa tähän viestiin, vaan ongelmatapauksissa ota yhteyttä jostrovs@gmail.com.\r\n-Jori\r\n";
         
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
        $mail->SetFrom ('tarkkailu@lentopalloerotuomarit.fi', 'Tarkkailuraportit');
        $mail->AddBCC ( 'jostrovs@gmail.com', 'Jori'); 
        $mail->Subject = $subject;
        $mail->ContentType = 'text/plain'; 
        $mail->IsHTML(false);
         
        $mail->Body = $body; 
        // you may also use $mail->Body = file_get_contents('your_mail_template.html');
         
        $mail->AddAddress ($to, $nimi);     
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
    
    // Sitten tehdään oikeita hommia

    $obj = json_decode($_POST["data"], true);

    $debug = array();
    //$debug["obj"] = $obj;
    $debug["phpFile"] = "insertReport.php";
    $report_id = 0; 

    $sql = "INSERT INTO raportti (koti, vieras, paikka, pvm, miehet, tulos, kesto_h, kesto_min, vaikeus, pt_huom, vt_huom, raportti_huom, pt_id, vt_id, tark_id, pt_score, vt_score)
            VALUES ('".obj('koti')."', '".obj('vieras')."', '".obj('paikka')."', '".obj('pvm')."', '"
                      .obj('miehet')."', '".obj('tulos')."', '".obj('kesto_h')."', '".obj('kesto_min')."', '".obj('vaikeus')."', '"
                      .obj('pt_huom')."', '".obj('vt_huom')."', '".obj('raportti_huom')."', '"
                      .obj('pt_id')."', '".obj('vt_id')."', '".obj('tark_id')."', '".obj('pt_score')."', '".obj('vt_score')."')";

    if ($mysqli->query($sql) === TRUE) {
        $report_id = $mysqli->insert_id;

        $sql1 = "INSERT INTO rivi (aihe_id, arvosana, raportti_id, huom) VALUES ";
        for($i=1;$i<18;$i++){
            if($i>1) $sql1 = $sql1 . ", ";
            $sql1 = $sql1 . valueRow($i);
        }

        $sql2 = "INSERT INTO rivi (aihe_id, arvosana, raportti_id, huom) VALUES ";
        for($i=101;$i<118;$i++){
            if($i>101) $sql2 = $sql2 . ", ";
            $sql2 = $sql2 . valueRow($i);
        }

        $mysqli->query($sql1);
        $mysqli->query($sql2);
    } else {
        jos_log("InsertReport SQL Error: " . $sql . "<br>" . $conn->error, JOS_LOG_IMPORTANT);
    }

    jos_log("Lisasi raportin " . $report_id . " " . obj('koti') . "-" . obj('vieras'), JOS_LOG_NORMAL);

    // Sähköpostin lähetys
    
    $data = array();
    $data["debug"] = $debug;
    echo json_encode($data);
    
    if(stripos($actual_link, 'localhost')){
    } else {
        // Haetaan tietoja
        $sql = "SELECT ra.pvm, ra.koti, ra.vieras, " .
        "       pt.etunimi as pt_etunimi, pt.sukunimi as pt_sukunimi, pt.email as pt_email, pt.token as pt_token, " .
        "       vt.etunimi as vt_etunimi, vt.sukunimi as vt_sukunimi, vt.email as vt_email, vt.token as vt_token, " .
        "       ta.etunimi as ta_etunimi, ta.sukunimi as ta_sukunimi " .
        "FROM raportti ra  " . 
        "JOIN tuomari pt ON pt.id = ra.pt_id " .
        "JOIN tuomari vt ON vt.id = ra.vt_id " .
        "JOIN tuomari ta ON ta.id = ra.tark_id " .
        "WHERE ra.id=" . $report_id;
        
        $result = $mysqli->query($sql);
        $row = $result->fetch_assoc();
        
        $pvm = $row['pvm'];
        $koti = $row['koti'];
        $vieras = $row['vieras'];
        $pt_email = $row['pt_email'];
        $pt_token = $row['pt_token'];
        $vt_email = $row['vt_email'];
        $vt_token = $row['vt_token'];
        $ta_etunimi = $row['ta_etunimi'];
        $ta_sukunimi = $row['ta_sukunimi'];
        $pt_etunimi = $row['pt_etunimi'];
        $pt_sukunimi = $row['pt_sukunimi'];
        $vt_etunimi = $row['vt_etunimi'];
        $vt_sukunimi = $row['vt_sukunimi'];
        
        $tarkkailija = $ta_etunimi . " " . $ta_sukunimi;
        $pt_nimi = $pt_etunimi . " " . $pt_sukunimi;
        $vt_nimi = $vt_etunimi . " " . $vt_sukunimi;
        $ottelu = $koti . " - " . $vieras;
        
        emailNotify($tarkkailija, $ottelu, $pt_email, $pt_token, $pt_nimi);
        emailNotify($tarkkailija, $ottelu, $vt_email, $vt_token, $vt_nimi);
    }

    $mysqli->close();
    
        
?>
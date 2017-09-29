<?php
    require 'dbConfig.php';
	$sqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
    $sqli->set_charset("utf8");    
    
    function exitWithError(){
        $data["error"] = 1;
        $data["msg"] = "Käyttäjää ei ole autentikoitu.";
        $enc = json_encode($data, JSON_UNESCAPED_UNICODE);
        if(!$enc) echo "Enkoodaus feilasi, ";
        else echo $enc;
        exit();    
    }

    //if (isset($_GET["token"])) { $token  = $_GET["token"]; } else { $token=0; };
    $token  = $_POST["token"];
    
    if($token == "0") exitWithError();
    
    // Autentikoidaan
    $sql = "SELECT rooli FROM tuomari WHERE token = '" . $token . "'"; 
    $result = $sqli->query($sql);
    $rooli = -1;
    while($row = $result->fetch_assoc()){
        $rooli = $row['rooli'];
    }
    $sqli->close();
    // echo "SQL: " . $sql . "<br>";
    // echo "Rooli: " . $rooli . "<br>";
    if($rooli != 0 && $rooli != 2) exitWithError(); // Hyväksytään vain roolit 0 ja 2, eli tarkkailija ja admin.

?>
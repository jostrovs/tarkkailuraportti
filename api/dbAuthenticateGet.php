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

    $token = $_GET["token"];
    
    if($token == "0") exitWithError();
    
    // Autentikoidaan
    $sql = "SELECT rooli FROM tuomari WHERE token = '" . $token . "'"; 
    $result = $sqli->query($sql);
    $rooli = -1;
    while($row = $result->fetch_assoc()){
        $rooli = $row;
    }
    $sqli->close();
    if($rooli < 0) exitWithError(); // Hyväksytään kaikki roolit, kunhan käyttäjä ylipäätään löytyy.

?>
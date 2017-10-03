<?php
    require_once('log.php');
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

    $token = $_POST["token"];
    
    if($token == "0") exitWithError();
    
    // Autentikoidaan
    $sql = "SELECT rooli, etunimi, sukunimi FROM tuomari WHERE token = '" . $token . "'"; 
    $result = $sqli->query($sql);
    $rooli = -1;
    $etunimi = "";
    $sukunimi = "";
    while($row = $result->fetch_assoc()){
        $rooli = $row['rooli'];
        $etunimi = $row['etunimi'];
        $sukunimi = $row['sukunimi'];
    }
    $sqli->close();
    if($rooli < 0){
        jos_log("POST käyttäjää ei autentikoitu " . $etunimi . " " . $sukunimi . " POST");
        exitWithError();
    }
    if($rooli != 0 && $rooli != 2){
        jos_log($etunimi . " " . $sukunimi . " ei autentikoitu POST, rooli: " . $rooli);
        exitWithError(); // Hyväksytään kaikki roolit, kunhan käyttäjä ylipäätään löytyy.
    } 

    jos_log($etunimi . " " . $sukunimi . " autentikoitu POST, rooli: " . $rooli);
?>
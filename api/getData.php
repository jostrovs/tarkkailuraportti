<?php

$cmd  = $_GET["cmd"];
$arg1  = $_GET["arg1"];
$token  = $_GET["token"];


require_once('log.php');

require 'dbConfig.php';
require 'dbAuthenticateGet.php';

	
// Tänne argumenttien mukaan datan hakua eri tauluista ja eri tarkoituksiin jne.
$debug = array();
$debug["phpFile"] = "getData.php";

jos_log("getData.php?cmd=" . $cmd . "&arg1=" . $arg1, JOS_LOG_DEBUG);

$cmd = $mysqli->real_escape_string($cmd);
$arg1 = $mysqli->real_escape_string($arg1);

$debug["komento"] = $cmd;
$debug["arg1"] = $arg1;

$sqlTotal = "SELECT email, etunimi, id, rooli, sukunimi FROM tuomari";
$sql = "SELECT * FROM tuomari"; 

switch($cmd){
    case API_HAE_TUOMARIT:
        $sql = "SELECT * FROM tuomari";
        break;
    case API_HAE_RAPORTIT:
        $sql = "SELECT 
                  r.id, r.koti, r.vieras, r.paikka, r.pvm, r.pt_id, r.vt_id, r.tark_id, r.pt_score, r.vt_score,
                  r.miehet, r.tulos, r.kesto_h, r.kesto_min, r.vaikeus, r.tulos,
                  r.pt_huom, r.vt_huom, r.raportti_huom, r.updated,
                  pt.etunimi as pt_etunimi, pt.sukunimi as pt_sukunimi,
                  vt.etunimi as vt_etunimi, vt.sukunimi as vt_sukunimi,
                  tark.etunimi as tark_etunimi, tark.sukunimi as tark_sukunimi
                FROM raportti r 
                JOIN tuomari pt   ON r.pt_id = pt.id 
                JOIN tuomari vt   ON r.vt_id = vt.id 
                JOIN tuomari tark ON r.tark_id = tark.id 
                WHERE r.deleted=0
                ";
        break;
    case API_HAE_RIVIT:
        $sql = "SELECT * FROM rivi r JOIN aihe a ON r.aihe_id = a.id where r.id = ".$arg1;
        break;
    case API_HAE_AIHEET:
        $sql = "SELECT * FROM aihe";
        break;
    case API_HAE_RAPORTIN_RIVIT:
        $sql = "SELECT * FROM rivi r 
                JOIN aihe a ON r.aihe_id = a.id 
                JOIN raportti ra ON ra.id = r.raportti_id 
                WHERE r.raportti_id=" . $arg1;
        break;
    case API_HAE_PT_RAPORTIT:
        $sql = "SELECT  ra.id as raportti_id, ra.koti, ra.vieras, ra.pvm, ra.pt_id, ra.vt_id, ra.pt_score, ra.vt_score,
                        ra.raportti_huom, ra.pt_huom, ra.vt_huom, ra.tulos, ra.updated,
                        r.id, r.arvosana, r.aihe_id, r.huom, 
                        a.no, a.otsikko
                FROM raportti ra
                JOIN rivi r ON r.raportti_id = ra.id
                JOIN aihe a ON r.aihe_id = a.id
                WHERE ra.deleted=0 AND pt_id = $arg1";
        break;
    case API_HAE_VT_RAPORTIT:
        $sql = "SELECT  ra.id as raportti_id, ra.koti, ra.vieras, ra.pvm, ra.pt_id, ra.vt_id, ra.pt_score, ra.vt_score,
                        ra.raportti_huom, ra.pt_huom, ra.vt_huom, ra.tulos, ra.updated,
                        r.id, r.arvosana, r.aihe_id, r.huom, 
                        a.no, a.otsikko
                FROM raportti ra
                JOIN rivi r ON r.raportti_id = ra.id
                JOIN aihe a ON r.aihe_id = a.id
                WHERE ra.deleted=0 AND vt_id = $arg1";
        break;
    case API_LOGIN:
        $sql = "UPDATE tuomari SET last_login = login_time, login_time=NOW() WHERE token = '" . $token . "';";
        
        $mysqli->query($sql);
        
        // $sql = "UPDATE tuomari SET login = NOW() WHERE token='" . $token . "'";
        // $result = $mysqli->query($sql);

        $sql = "SELECT etunimi, sukunimi, email, token, rooli, id, login_time, last_login FROM tuomari WHERE token='" . $token . "'";
        break;
    case API_SAVE_EMAIL:
        $sql = "UPDATE tuomari SET email='" . $arg1 . "' WHERE token='" . $token . "'";
        $data = 1;
        break;
    default:
        $sql = "Ei mit&auml;&auml;n, v&auml;&auml;r&auml; komento annettu.";
}

$debug["sql"] = $sql;

$result = $mysqli->query($sql);

if($cmd != API_SAVE_EMAIL){
    while($row = $result->fetch_assoc()){
        $json[] = $row;
    }
}

if($cmd == API_HAE_RAPORTIN_RIVIT){
    jos_log("pyysi raporttia " . $arg1 . " " . $json[0]['koti'] . "-" . $json[0]['vieras'], JOS_LOG_NORMAL);    
}

$data['data'] = $json;

$result =  mysqli_query($mysqli,$sqlTotal);

$data['total'] = mysqli_num_rows($result);
$data['debug'] = $debug;

$enc = json_encode($data, JSON_UNESCAPED_UNICODE);
if(!$enc) echo "Enkoodaus feilasi, ";
else echo $enc;

?>
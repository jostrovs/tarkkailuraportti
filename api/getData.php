<?php
require 'dbConfig.php';

	define (API_HAE_TUOMARIT, 1);
	define (API_HAE_RAPORTIT, 2);
	define (API_HAE_RIVIT, 3);
	define (API_HAE_AIHEET, 4);
	
    define (API_HAE_RAPORTIN_RIVIT, 5);
   
    define (API_HAE_PT_RAPORTIT, 6);
    define (API_HAE_VT_RAPORTIT, 7);
	
// Tänne argumenttien mukaan datan hakua eri tauluista ja eri tarkoituksiin jne.

$debug = array();
$debug["phpFile"] = "getData.php";

if (isset($_GET["cmd"])) { $cmd  = $_GET["cmd"]; } else { $cmd=API_HAE_TUOMARIT; };
if (isset($_GET["arg1"])) { $arg1  = $_GET["arg1"]; } else { $arg1=0; };

$cmd = $mysqli->real_escape_string($cmd);
$arg1 = $mysqli->real_escape_string($arg1);

$debug["komento"] = $cmd;
$debug["arg1"] = $arg1;



$sqlTotal = "SELECT * FROM tuomari";
$sql = "SELECT * FROM tuomari"; 

switch($cmd){
    case API_HAE_TUOMARIT:
        $sql = "SELECT * FROM tuomari";
        break;
    case API_HAE_RAPORTIT:
        $sql = "SELECT 
                  r.id, r.koti, r.vieras, r.paikka, r.pvm, r.pt_id, r.vt_id, r.tark_id,
                  pt.etunimi as pt_etunimi, pt.sukunimi as pt_sukunimi,
                  vt.etunimi as vt_etunimi, vt.sukunimi as vt_sukunimi,
                  tark.etunimi as tark_etunimi, tark.sukunimi as tark_sukunimi
                FROM raportti r 
                JOIN tuomari pt   ON r.pt_id = pt.id 
                JOIN tuomari vt   ON r.vt_id = vt.id 
                JOIN tuomari tark ON r.tark_id = tark.id 
                ";
        break;
    case API_HAE_RIVIT:
        $sql = "SELECT * FROM rivi r JOIN aihe a ON r.aihe_id = a.id";
        break;
    case API_HAE_AIHEET:
        $sql = "SELECT * FROM aihe";
        break;
    case API_HAE_RAPORTIN_RIVIT:
        $sql = "SELECT * FROM rivi r JOIN aihe a ON r.aihe_id = a.id WHERE r.raportti_id=" . $arg1;
        break;
    case API_HAE_PT_RAPORTIT:
        $sql = "SELECT  ra.id as raportti_id, ra.koti, ra.vieras, ra.pvm, ra.pt_id, ra.vt_id, 
                        r.id, r.arvosana, r.aihe_id, r.huom, 
                        a.no
                FROM raportti ra
                JOIN rivi r ON r.raportti_id = ra.id
                JOIN aihe a ON r.aihe_id = a.id
                WHERE pt_id = $arg1";
        break;
    case API_HAE_VT_RAPORTIT:
        $sql = "SELECT  ra.id as raportti_id, ra.koti, ra.vieras, ra.pvm, ra.pt_id, ra.vt_id, 
                        r.id, r.arvosana, r.aihe_id, r.huom, 
                        a.no
                FROM raportti ra
                JOIN rivi r ON r.raportti_id = ra.id
                JOIN aihe a ON r.aihe_id = a.id
                WHERE vt_id = $arg1";
        break;
}

$debug["sql"] = $sql;

$result = $mysqli->query($sql);

  while($row = $result->fetch_assoc()){

     $json[] = $row;

  }

  $data['data'] = $json;

$result =  mysqli_query($mysqli,$sqlTotal);

$data['total'] = mysqli_num_rows($result);
$data['debug'] = $debug;
echo json_encode($data);

file_put_contents('c:\\d\\omagit\\tark\\phpdebug\\my_debug_file.txt', json_encode($data));
?>
<?php
require 'dbConfig.php';

	define (API_HAE_TUOMARIT, 1);
	define (API_HAE_RAPORTIT, 2);
	define (API_HAE_RIVIT, 3);
	define (API_HAE_AIHEET, 4);
	
// Tänne argumenttien mukaan datan hakua eri tauluista ja eri tarkoituksiin jne.



if (isset($_GET["cmd"])) { $cmd  = $_GET["cmd"]; } else { $cmd=API_HAE_TUOMARIT; };

$sqlTotal = "SELECT * FROM tuomari";
$sql = "SELECT * FROM tuomari"; 

switch($cmd){
    case API_HAE_TUOMARIT:
        $sql = "SELECT * FROM tuomari";
        break;
    case API_HAE_RAPORTIT:
        $sql = "SELECT * FROM raportti";
        break;
    case API_HAE_RIVIT:
        $sql = "SELECT * FROM rivi r JOIN aihe a ON r.aihe_id = a.id";
        break;
    case API_HAE_AIHEET:
        $sql = "SELECT * FROM aihe";
        break;
}

$result = $mysqli->query($sql);

  while($row = $result->fetch_assoc()){

     $json[] = $row;

  }

  $data['data'] = $json;

$result =  mysqli_query($mysqli,$sqlTotal);

$data['total'] = mysqli_num_rows($result);

echo json_encode($data);

?>
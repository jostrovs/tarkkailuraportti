<?php
    require 'dbConfig.php';

    //header("Content-Type: application/json; charset=UTF-8");
    //$obj = json_decode($_POST["data"], false);
    $obj = json_decode($_POST["data"], true);
    //$obj = '{"a":1,"b":2,"c":3,"d":4,"e":5}';
    //echo "Hip hei!";

    echo json_encode($obj);
?>
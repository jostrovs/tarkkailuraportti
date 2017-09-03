<?php
    require 'dbConfig.php';

    $obj = json_decode($_POST["data"], true);

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

    $debug = array();
    //$debug["obj"] = $obj;
    $debug["phpFile"] = "insertReport.php";
    
    $sql = "INSERT INTO raportti (koti, vieras, paikka, pvm, miehet, tulos, kesto_h, kesto_min, vaikeus, pt_id, vt_id, tark_id, pt_score, vt_score)
            VALUES ('".obj('koti')."', '".obj('vieras')."', '".obj('paikka')."', '".obj('pvm')."', '"
                      .obj('miehet')."', '".obj('tulos')."', '".obj('kesto_h')."', '".obj('kesto_min')."', '".obj('vaikeus')."', '"
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
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $mysqli->close();

    //$debug["sql1"] = $sql1;
    //$debug["sql2"] = $sql2;
    $data = array();
    $data["debug"] = $debug;
    echo json_encode($data);
?>
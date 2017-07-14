<?php
    require 'dbConfig.php';

    $obj = json_decode($_POST["data"], true);

    $sql = "INSERT INTO raportti (koti, vieras, paikka, pvm, pt_id, vt_id, tark_id)
            VALUES ('".$obj['koti']."', '".$obj['vieras']."', '".$obj['paikka']."', '".$obj['pvm']."', '".$obj['pt_id']."', '".$obj['vt_id']."', '".$obj['tark_id']."')";

    if ($mysqli->query($sql) === TRUE) {
        $report_id = $mysqli->insert_id;

        $sql = "INSERT INTO rivi (aihe_id, arvosana, raportti_id, huom)
                VALUES (".$obj['aihe_1_id'].", ".$obj['aihe_1_arvosana'].", ".$report_id.", ''),
                       (".$obj['aihe_2_id'].", ".$obj['aihe_2_arvosana'].", ".$report_id.", '')
                ";
        $mysqli->query($sql);
        echo json_encode($obj);
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $mysqli->close();
?>
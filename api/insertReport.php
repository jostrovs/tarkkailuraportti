<?php
    require 'dbConfig.php';

    $obj = json_decode($_POST["data"], true);

    $debug = array();
    $debug["obj"] = $obj;
    $debug["phpFile"] = "insertReport.php";

    $sql = "INSERT INTO raportti (koti, vieras, paikka, pvm, pt_id, vt_id, tark_id)
            VALUES ('".$obj['koti']."', '".$obj['vieras']."', '".$obj['paikka']."', '".$obj['pvm']."', '".$obj['pt_id']."', '".$obj['vt_id']."', '".$obj['tark_id']."')";

    if ($mysqli->query($sql) === TRUE) {
        $report_id = $mysqli->insert_id;

        $sql = "INSERT INTO rivi (aihe_id, arvosana, raportti_id, huom)
                VALUES (".$obj['aihe_1_id'].", ".$obj['aihe_1_arvosana'].", ".$report_id.", '".$obj['aihe_1_huom']."'),
                       (".$obj['aihe_2_id'].", ".$obj['aihe_2_arvosana'].", ".$report_id.", '".$obj['aihe_2_huom']."'),
                       (".$obj['aihe_3_id'].", ".$obj['aihe_3_arvosana'].", ".$report_id.", '".$obj['aihe_3_huom']."'),
                       (".$obj['aihe_4_id'].", ".$obj['aihe_4_arvosana'].", ".$report_id.", '".$obj['aihe_4_huom']."'),
                       (".$obj['aihe_5_id'].", ".$obj['aihe_5_arvosana'].", ".$report_id.", '".$obj['aihe_5_huom']."'),
                       (".$obj['aihe_6_id'].", ".$obj['aihe_6_arvosana'].", ".$report_id.", '".$obj['aihe_6_huom']."'),
                       (".$obj['aihe_7_id'].", ".$obj['aihe_7_arvosana'].", ".$report_id.", '".$obj['aihe_7_huom']."'),
                       (".$obj['aihe_8_id'].", ".$obj['aihe_8_arvosana'].", ".$report_id.", '".$obj['aihe_8_huom']."'),
                       (".$obj['aihe_9_id'].", ".$obj['aihe_9_arvosana'].", ".$report_id.", '".$obj['aihe_9_huom']."'),
                       (".$obj['aihe_10_id'].", ".$obj['aihe_10_arvosana'].", ".$report_id.", '".$obj['aihe_10_huom']."'),
                       (".$obj['aihe_11_id'].", ".$obj['aihe_11_arvosana'].", ".$report_id.", '".$obj['aihe_11_huom']."'),
                       (".$obj['aihe_12_id'].", ".$obj['aihe_12_arvosana'].", ".$report_id.", '".$obj['aihe_12_huom']."'),
                       (".$obj['aihe_13_id'].", ".$obj['aihe_13_arvosana'].", ".$report_id.", '".$obj['aihe_13_huom']."'),
                       (".$obj['aihe_14_id'].", ".$obj['aihe_14_arvosana'].", ".$report_id.", '".$obj['aihe_14_huom']."'),
                       (".$obj['aihe_15_id'].", ".$obj['aihe_15_arvosana'].", ".$report_id.", '".$obj['aihe_15_huom']."'),
                       (".$obj['aihe_16_id'].", ".$obj['aihe_16_arvosana'].", ".$report_id.", '".$obj['aihe_16_huom']."'),
                       (".$obj['aihe_17_id'].", ".$obj['aihe_17_arvosana'].", ".$report_id.", '".$obj['aihe_17_huom']."'),

                       (".$obj['aihe_101_id'].", ".$obj['aihe_101_arvosana'].", ".$report_id.", '".$obj['aihe_101_huom']."'),
                       (".$obj['aihe_103_id'].", ".$obj['aihe_103_arvosana'].", ".$report_id.", '".$obj['aihe_103_huom']."'),
                       (".$obj['aihe_102_id'].", ".$obj['aihe_102_arvosana'].", ".$report_id.", '".$obj['aihe_102_huom']."'),
                       (".$obj['aihe_104_id'].", ".$obj['aihe_104_arvosana'].", ".$report_id.", '".$obj['aihe_104_huom']."'),
                       (".$obj['aihe_105_id'].", ".$obj['aihe_105_arvosana'].", ".$report_id.", '".$obj['aihe_105_huom']."'),
                       (".$obj['aihe_106_id'].", ".$obj['aihe_106_arvosana'].", ".$report_id.", '".$obj['aihe_106_huom']."'),
                       (".$obj['aihe_107_id'].", ".$obj['aihe_107_arvosana'].", ".$report_id.", '".$obj['aihe_107_huom']."'),
                       (".$obj['aihe_108_id'].", ".$obj['aihe_108_arvosana'].", ".$report_id.", '".$obj['aihe_108_huom']."'),
                       (".$obj['aihe_109_id'].", ".$obj['aihe_109_arvosana'].", ".$report_id.", '".$obj['aihe_109_huom']."'),
                       (".$obj['aihe_110_id'].", ".$obj['aihe_110_arvosana'].", ".$report_id.", '".$obj['aihe_110_huom']."'),
                       (".$obj['aihe_111_id'].", ".$obj['aihe_111_arvosana'].", ".$report_id.", '".$obj['aihe_111_huom']."'),
                       (".$obj['aihe_112_id'].", ".$obj['aihe_112_arvosana'].", ".$report_id.", '".$obj['aihe_112_huom']."'),
                       (".$obj['aihe_113_id'].", ".$obj['aihe_113_arvosana'].", ".$report_id.", '".$obj['aihe_113_huom']."'),
                       (".$obj['aihe_114_id'].", ".$obj['aihe_114_arvosana'].", ".$report_id.", '".$obj['aihe_114_huom']."'),
                       (".$obj['aihe_115_id'].", ".$obj['aihe_115_arvosana'].", ".$report_id.", '".$obj['aihe_115_huom']."'),
                       (".$obj['aihe_116_id'].", ".$obj['aihe_116_arvosana'].", ".$report_id.", '".$obj['aihe_116_huom']."'),
                       (".$obj['aihe_117_id'].", ".$obj['aihe_117_arvosana'].", ".$report_id.", '".$obj['aihe_117_huom']."')
                ";
        $mysqli->query($sql);
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $mysqli->close();

    $debug["sql"] = $sql;
    $debug["aihe_1_huom"] = $obj['aihe_1_huom'];
    $data = array();
    $data["debug"] = $debug;
    echo json_encode($data);
?>
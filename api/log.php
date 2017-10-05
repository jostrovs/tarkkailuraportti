<?php

define (JOS_LOG_NORMAL, 1);
define (JOS_LOG_IMPORTANT, 2);
define (JOS_LOG_DEBUG, 0);


$jos_log_level = JOS_LOG_NORMAL;

function isLocalhost(){
    $actual_link = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
    if(stripos($actual_link)>-1) return true;
    return false; 
}

function getIp(){
    $ip = getenv('HTTP_CLIENT_IP')?:
    getenv('HTTP_X_FORWARDED_FOR')?:
    getenv('HTTP_X_FORWARDED')?:
    getenv('HTTP_FORWARDED_FOR')?:
    getenv('HTTP_FORWARDED')?:
    getenv('REMOTE_ADDR');
    
    return $ip;
}

function jos_log($line, $level=JOS_LOG_NORMAL){
    global $jos_log_level;
    if($level < $jos_log_level) return;
 
    $date = date('Y.m.d h:i:sa');
    $ip = getIp();
    $myfile = fopen("./log/log.txt", "a") or die("Unable to open file!");
    fwrite($myfile, $date . " - " . $ip . " - " . $line . "\n");
    fclose($myfile);
}
?>
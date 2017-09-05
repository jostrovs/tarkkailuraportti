<?php
    mb_internal_encoding("UTF-8");
	//mysql_query("set names 'utf8'");
	
	define (DB_USER, "lentopallo_tark");
	define (DB_PASSWORD, "lentopallo_tark");
	define (DB_DATABASE, "lentopallo_tark");
	define (DB_HOST, "localhost");

	$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
	$mysqli->set_charset("utf8")
?>
<?php
	define (DB_USER, "jori");
	define (DB_PASSWORD, "jori");
	define (DB_DATABASE, "lentopallo_tark");
	define (DB_HOST, "localhost");

	$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
?>
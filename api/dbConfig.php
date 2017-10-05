<?php
    mb_internal_encoding("UTF-8");
	//mysql_query("set names 'utf8'");
	define (API_HAE_TUOMARIT, 1);
	define (API_HAE_RAPORTIT, 2);
	define (API_HAE_RIVIT, 3);
	define (API_HAE_AIHEET, 4);
	
    define (API_HAE_RAPORTIN_RIVIT, 5);
   
    define (API_HAE_PT_RAPORTIT, 6);
    define (API_HAE_VT_RAPORTIT, 7);
    
    define (API_LOGIN, 8);
	define (API_SAVE_EMAIL, 9);
	
	
	define (DB_USER, "lentopallo_tark");
	define (DB_PASSWORD, "lentopallo_tark");
	define (DB_DATABASE, "lentopallo_tark");
	define (DB_HOST, "localhost");

	$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
	$mysqli->set_charset("utf8")
?>
<?php
	$json = json_decode(file_get_contents('php://input'));
	echo "Hello ". $json->firstname . " ".$json->lastname;
?>

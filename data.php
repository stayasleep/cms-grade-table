<?php

define('fromData',true);

$action = $_GET['action'];
if(empty($action)){
	exit('no action specified');
}
//require the mysql_connect.php file.  Make sure your properly configured it!
require('./mysql_connect.php');

$output = [
	'success'=> false, //we assume we will fail
	'errors'=>[]
];

switch($action){
	case 'readAll':
		//include the php file 'read.php'
        include('./dataApi/read.php');
		break;
	case 'insert':
		//include the php file insert.php
        include('./dataApi/insert.php');
		break;
	case 'delete':
		//include the php file delete.php
        include('./dataApi/delete.php');
		break;
	case 'update':
		//include the update.php file
        include('./dataApi/update.php');
		break;
}
//convert the $output variable to json, store the result in $outputJSON
$outputJSON=json_encode($output);
//print $outputJSON
  print_r($outputJSON);

//end
?>
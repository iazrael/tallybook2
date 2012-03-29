<?php
require_once('JSON.php');
require_once('common.php');

if($_IS_NEED_LOGIN){
	$uid = $_SESSION['uid'];
	
	if(!isset($uid)){
		$json = new Services_JSON();
		$result = array();
		$result[success] = 0;
		$result[errorCode] = $_NOT_LOGIN;
		print($json->encode($result));
		exit();
	}
}
?>
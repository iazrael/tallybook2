<?php
	//常量定义
	$_VAR_TYPE_ERROR = 1001;
	$_VAR_VALUE_ERROR = 1002;
	
	$_DATABASE_INSERT_ERROR = 2001;
	
	$_NOT_LOGIN = 403;
	$_NO_AUTHORIZATION = 503;
	$_IS_NEED_LOGIN = false;
	$_IS_RECORD_DELETABLE = true;
?>

<?php
	//常用方法
	function escape_string($str){
		return mysql_real_escape_string(trim($str));
	}
	
?>

<?php
	//一些初始化
	error_reporting(E_ERROR | E_WARNING | E_PARSE);
	header('Content-Type: application/json; charset=UTF-8');
	session_start();
?>
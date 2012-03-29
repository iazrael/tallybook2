<?php
	//常量定义
	//变量相关
	$_VAR_TYPE_ERROR = 2001;
	$_VAR_VALUE_ERROR = 2002;

	//账号相关错误
	$_USER_NOT_EXIST = 2101;
	$_USER_LOGIN_FAILURE = 2102;
	$_USER_AUTO_LOGIN_FAILURE = 2102;
	
	//数据库相关
	$_DATABASE_INSERT_ERROR = 2201;

	$_NOT_LOGIN = 403;
	$_NO_AUTHORIZATION = 503;

	//配置
	$_IS_NEED_LOGIN = true;
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
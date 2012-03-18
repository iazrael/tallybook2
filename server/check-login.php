<?php
if($_IS_NEED_LOGIN){
	session_start();
	$login = $_SESSION['logininfo'];
	if(isset($login) && $login='3.141592654'){
		
	}else{
		header("HTTP/1.1 303 To Login");
		header("Location: login.php");
		exit();
	}
}
?>
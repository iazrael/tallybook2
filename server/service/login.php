<?php
	require_once('../tbdb.php');
	require_once('../JSON.php');
	require_once('../common.php');

	$json = new Services_JSON();
	$result = array();
	$list = array();
	$parents = array();

	$username = escape_string($_POST['username']);
	$autoLogin = escape_string($_POST['autoLogin']);
	$password = escape_string($_POST['password']);
	$token = escape_string($_POST['token']);
	$autoLoginNext = escape_string($_POST['autoLoginNext']);

	$ip = $_SERVER["REMOTE_ADDR"]; 

	if($autoLogin == 1 && preg_match('/[a-zA-Z0-9]{4,}/', $username) && isset($token)){
		//自动登录
		$queryString = "SELECT * FROM user WHERE uname='$username' AND token='$token'";# AND lastLoginIp='$ip'";
		$user = $tbdb->getfirst($queryString);
      	if($user){
      		$queryString = "UPDATE user SET lastLoginTime=now(), lastLoginIp='$ip' WHERE uname='$username'";
      		if($tbdb->update($queryString)){

      			$_SESSION['uid'] = $user[uid];
      			$_SESSION['username'] = $username;

      			$result[success] = 1;
				$result[result]['username'] = $username;
				$result[result]['token'] = $token;
				$result[result]['autoLogin'] = $autoLogin + 0;

				$result[result]['tagsLastModified'] = $user[tagsChangeTime];
				$result[result]['catesLastModified'] = $user[catesChangeTime];

	      		print($json->encode($result));
      		}else{
      			$result[success] = 0;
				$result[errorCode] = $_USER_AUTO_LOGIN_FAILURE;
				$result[errorMsg] = 'user auto login failure';

				$result[result]['param']['username'] = $username;
				$result[result]['param']['autoLogin'] = $autoLogin + 0;
				$result[result]['param']['token'] = $token;

				print($json->encode($result));
      		}
      	}else{
      		$result[success] = 0;
			$result[errorCode] = $_USER_AUTO_LOGIN_FAILURE;
			$result[errorMsg] = 'user auto login failure';

			$result[result]['param']['username'] = $username;
			$result[result]['param']['autoLogin'] = $autoLogin + 0;
			$result[result]['param']['token'] = $token;

			print($json->encode($result));
      	}
	}else if(preg_match('/[a-zA-Z0-9]{4,}/', $username) && preg_match('/[\w\.]{6,}/', $password)){
		//登录
		$pwdMd5 = md5($password);
		$queryString = "SELECT * FROM user WHERE uname='$username' AND pwd='$pwdMd5'";
		$user = $tbdb->getfirst($queryString);
      	if($user){

      		$token = md5($pwdMd5.$username.$ip);

      		$queryString = "UPDATE user SET lastLoginTime=now(), lastLoginIp='$ip', token='$token' WHERE uname='$username'";
      		if($tbdb->update($queryString)){

      			$_SESSION['uid'] = $user[uid];
      			$_SESSION['username'] = $username;

      			$result[success] = 1;
				$result[result]['username'] = $username;
				$result[result]['token'] = $token;
				$result[result]['autoLogin'] = $autoLoginNext + 0;

				$result[result]['tagsLastModified'] = $user[tagsChangeTime];
				$result[result]['catesLastModified'] = $user[catesChangeTime];

	      		print($json->encode($result));
      		}else{
      			$result[success] = 0;
				$result[errorCode] = $_USER_LOGIN_FAILURE;
				$result[errorMsg] = 'user login failure';
				$result[result]['param']['username'] = $username;
				$result[result]['param']['password'] = $password;

				print($json->encode($result));
      		}
      		
		}else{
			$result[success] = 0;
			$result[errorCode] = $_USER_NOT_EXIST;
			$result[errorMsg] = 'user not exists';
			$result[result]['param']['username'] = $username;
			$result[result]['param']['password'] = $password;
			
			print($json->encode($result));
		}
	}else{
		$result[success] = 0;
		$result[errorCode] = $_VAR_TYPE_ERROR;
		$result[errorMsg] = 'data format error';
		if($autoLogin == 1){
			$result[result]['param']['username'] = $username;
			$result[result]['param']['autoLogin'] = $autoLogin + 0;
			$result[result]['param']['token'] = $token;
		}else{
			$result[result]['param']['username'] = $username;
			$result[result]['param']['password'] = $password;
		}
		print($json->encode($result));
	}


?>
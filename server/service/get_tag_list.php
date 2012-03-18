<?php
	require_once('../tbdb.php');
	require_once('../JSON.php');
	require_once('../common.php');
	require_once('../check-right.php');
	
	header('Content-Type: application/json; charset=UTF-8');
	$json = new Services_JSON();
	$result = array();
	$list = array();

	$_SESSION['uid'] = 1;
	$uid = $_SESSION['uid'];

	$queryString = "SELECT id, name FROM tag WHERE uid='$uid'";
	$qresult = $tbdb->query($queryString);
	while($row=$tbdb->getarray($qresult)){
		$list[] = array(
				id=>$row[id] + 0,
				name=>$row[name]
			);
	}

	$result[success] = 1;
	$result[result]['list'] = $list;
	print($json->encode($result));


?>
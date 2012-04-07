<?php
	require_once('../tbdb.php');
	require_once('../JSON.php');
	require_once('../common.php');
	require_once('../check-right.php');
	
	$json = new Services_JSON();
	$result = array();
	$list = array();

	$uid = $_SESSION['uid'];

	$queryString = "SELECT id, name FROM tag WHERE uid='$uid'";
	$qresult = $tbdb->query($queryString);
	while($row=$tbdb->getarray($qresult)){
		$list[] = array(
				id=>$row[id] + 0,
				name=>$row[name]
			);
	}
	$queryString = "SELECT tagsChangeTime FROM user WHERE uid='$uid'";
	$qresult = $tbdb->getfirst($queryString);

	$result[success] = 1;
	$result[result]['list'] = $list;
	$result[result]['lastModified'] = $qresult[tagsChangeTime];
	print($json->encode($result));


?>
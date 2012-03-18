<?php
	require_once('../tbdb.php');
	require_once('../JSON.php');
	require_once('../common.php');
	require_once('../check-right.php');
	
	header('Content-Type: application/json; charset=UTF-8');
	$json = new Services_JSON();
	$result = array();
	$list = array();
	$parents = array();

	$_SESSION['uid'] = 1;
	$uid = $_SESSION['uid'];


	$queryString = "SELECT * FROM category c WHERE uid='$uid' ORDER BY type, parentId, c.index DESC";
	$qresult = $tbdb->query($queryString);
	while($row=$tbdb->getarray($qresult)){
		$item = array(
				id=>$row[id] + 0,
				name=>$row[name],
				parentId=>$row[parentId] + 0,
				type=>$row[type] + 0,
				index=>$row[index] + 0
			);
		if($item[parentId] != 0){
			$index = $parents[$item[parentId]];
			$list[$index]['children'][] = $item;
		}else{
			$parents[$item[id]] = count($list);
			$list[] = $item;
		}
	}
	
	$result[success] = 1;
	$result[result]['list'] = $list;
	print($json->encode($result));
	// print($json->encode($parents));


?>
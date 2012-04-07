<?php
	require_once('../tbdb.php');
	require_once('../JSON.php');
	require_once('../common.php');
	require_once('../check-right.php');
	
	$json = new Services_JSON();
	$result = array();
	$list = array();
	$parents = array();
	
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
	$queryString = "SELECT catesChangeTime FROM user WHERE uid='$uid'";
	$qresult = $tbdb->getfirst($queryString);

	$result[success] = 1;
	$result[result]['list'] = $list;
	$result[result]['lastModified'] = $qresult[catesChangeTime];
	print($json->encode($result));
	// print($json->encode($parents));


?>
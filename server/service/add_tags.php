<?php
	require_once('../tbdb.php');
	require_once('../JSON.php');
	require_once('../common.php');
	require_once('../check-right.php');
	
	
	$json = new Services_JSON();
	$result = array();

	
	$uid = $_SESSION['uid'];
	
	$tags = trim(escape_string($_POST['tags']));

	if(!empty($tags)){
		$tagList = explode(',',$tags);
		$list = array();
		foreach ($tagList as $name) {
			$name = trim($name);
			if(!$name){
				continue;
			}
			$sqlString = $queryString = "SELECT id, name FROM tag WHERE uid='$uid' AND name='$name'";
			$exist = $tbdb->getfirst($sqlString);//只拿第一个就行了
			if($exist){
				$list[] = array(
					id=>$exist[id] + 0,
					name=>$name
				);

			}else{
				$sqlString = "INSERT INTO tag(name,createTime,updateTime,uid) VALUES('$name', now(), now(), $uid) ";
				if($tbdb->insert($sqlString)){
					$newId = $tbdb->getid() + 0;
					$list[] = array(
						id=>$newId,
						name=>$name
					);
				}else{
					$result[success] = 0;
					$result[errorCode] = $_DATABASE_INSERT_ERROR;
					$result[result]['param']['tags'] = $tags;
					$result[result]['param']['failTag'] = $name;

					print($json->encode($result));
					exit();
				}
			}
		}
		$modify = date('Y-m-d H:m:s');
		$queryString = "UPDATE user SET tagsChangeTime='$modify' WHERE uid='$uid'";
  		$tbdb->update($queryString);

		$result[success] = 1;
		$result[result]['list'] = $list;
		$result[result]['lastModified'] = $modify;
		$result[result]['param']['tags'] = $tags;

		print($json->encode($result));
		
	}else{
		$result[success] = 0;
		$result[errorCode] = $_VAR_TYPE_ERROR;
		
		$result[result]['param']['tags'] = $tags;

		print($json->encode($result));
	}


?>
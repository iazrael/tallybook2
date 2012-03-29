<?php
	require_once('../tbdb.php');
	require_once('../JSON.php');
	require_once('../common.php');
	require_once('../check-right.php');
	
	
	$json = new Services_JSON();
	$result = array();

	$uid = $_SESSION['uid'];
	
	$occurredTime = escape_string($_POST['occurredTime']);
	$amount = escape_string($_POST['amount']);
	$categoryId = escape_string($_POST['categoryId']);
	$type = escape_string($_POST['type']);
	$remark = escape_string($_POST['remark']);
	
	if(is_numeric($amount) && is_numeric($type) && is_numeric($categoryId) && preg_match('/\d{4}-\d{2}-\d{2}/',$occurredTime)){

		$sqlString = "INSERT INTO bill(amount,occurredTime,categoryId,remark,type,createTime,updateTime,uid) 
			VALUES($amount,'$occurredTime',$categoryId,'$remark', $type, now(), now(), $uid) ";
		if($tbdb->insert($sqlString)){
			$result[success] = 1;
			
			$result[result]['data'] = array(
				id=>$tbdb->getid() + 0,
				amount=>$amount + 0,
				categoryId=>$categoryId + 0,
				// tags => $tags,
				remark=>$remark,
				occurredTime=>$occurredTime,
				type=>$type + 0
			);

			print($json->encode($result));
		}else{
			$result[success] = 0;
			$result[errorCode] = $_DATABASE_INSERT_ERROR;

			$result[result]['param']['occurredTime'] = $occurredTime;
			$result[result]['param']['amount'] = $amount;
			$result[result]['param']['remark'] = $remark;
			$result[result]['param']['type'] = $type;
			$result[result]['param']['categoryId'] = $categoryId;

			print($json->encode($result));
		}
		
	}else{
		$result[success] = 0;
		$result[errorCode] = $_VAR_TYPE_ERROR;
		
		$result[result]['param']['occurredTime'] = $occurredTime;
		$result[result]['param']['amount'] = $amount;
		$result[result]['param']['remark'] = $remark;
		$result[result]['param']['type'] = $type;
		$result[result]['param']['categoryId'] = $categoryId;

		print($json->encode($result));
	}


?>
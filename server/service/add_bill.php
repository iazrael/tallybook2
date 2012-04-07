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
	$tags = escape_string($_POST['tags']);
	
	if(is_numeric($amount) && is_numeric($type) && is_numeric($categoryId) && preg_match('/\d{4}-\d{2}-\d{2}/',$occurredTime)){

		$sqlString = "INSERT INTO bill(amount,occurredTime,categoryId,remark,type,createTime,updateTime,uid) 
			VALUES($amount,'$occurredTime',$categoryId,'$remark', $type, now(), now(), $uid) ";
		if($tbdb->insert($sqlString)){
			$newBillId = $tbdb->getid() + 0;
			
			$tagList = explode(',',$tags);
			if(!empty($tags) && count($tagList)){
				
				for($i = 0; $i < count($tagList); $i ++){
					$tagList[$i] += 0;
				}
				$first = true;
				$sqlString = "INSERT INTO bill_tags(billId, tagId, createTime, uid) VALUES";
				foreach ($tagList as $tagId) {
					if(!$first){
						$sqlString  .= ",";
					}
					$first = false;
					$sqlString .= "($newBillId, $tagId, now(), $uid)";
				}
				// print($sqlString);
				$billTagResult = $tbdb->insert($sqlString);
				if($billTagResult){
					$result[result]['billTagRelevance'] = 1;
				}else{
					$result[result]['billTagRelevance'] = 0;
				}
				
			}else{
				$tagList = array();
			}
			
			$result[success] = 1;
			$result[result]['data'] = array(
				id=> $newBillId,
				amount=>$amount + 0,
				categoryId=>$categoryId + 0,
				tags => $tagList,
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
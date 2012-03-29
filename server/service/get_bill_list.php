<?php
	require_once('../tbdb.php');
	require_once('../JSON.php');
	require_once('../common.php');
	require_once('../check-right.php');
	
	
	$json = new Services_JSON();
	$result = array();
	
	$uid = $_SESSION['uid'];
	
	$date = escape_string($_GET['date']);
	$start = escape_string($_GET['start']);
	$count = escape_string($_GET['count']);
	if(is_numeric($start) && is_numeric($count) && preg_match('/\d{4}-\d{2}-\d{2}/',$date)){
	
		if($start < 0 || $count < 0){
			$result[success] = 0;
			$result[code] = $_VAR_VALUE_ERROR;
			print($json->encode($result));
		}else{
			$queryString = "SELECT id FROM bill c WHERE uid = '$uid' AND occurredTime = '$date'";
			//查询总数
			
			$totalCount = $tbdb->getcount($queryString);
			$list = array();
			if($totalCount){//没有符合条件的记录时，减少一次数据库查询
				$queryString = "SELECT id, amount, categoryId, remark, occurredTime, type 
					FROM bill c WHERE uid = '$uid' AND occurredTime = '$date' ORDER BY createTime DESC LIMIT $start,$count";
				$qresult = $tbdb->query($queryString);
				
				while($row=$tbdb->getarray($qresult)){
					$billId = $row[id];
					$tags = array();
					$queryString = "SELECT tagId FROM bill_tags WHERE uid = '$uid' AND billId=$billId";
					$tagResult = $tbdb->query($queryString);
					while($tag=$tbdb->getarray($tagResult)){
						$tags[] = $tag[tagId] + 0;
					}
					$list[] = array(
							id=>$row[id] + 0,
							amount=>$row[amount] + 0,
							categoryId=>$row[categoryId] + 0,
							tags => $tags,
							remark=>$row[remark],
							occurredTime=>$row[occurredTime],
							type=>$row[type] + 0
						);
				}
			}else{
				$totalCount = 0;
			}
			$result[success] = 1;
			$result[result]['list'] = $list;
			$result[result]['total'] = $totalCount + 0;
			$result[result]['param']['date'] = $date;
			$result[result]['param']['start'] = $start + 0;
			$result[result]['param']['count'] = $count + 0;
			print($json->encode($result));
		}
	}else{
		$result[success] = 0;
		$result[errorCode] = $_VAR_TYPE_ERROR;
		print($json->encode($result));
	}


?>
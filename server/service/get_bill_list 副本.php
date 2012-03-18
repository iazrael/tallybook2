<?php
	require_once('../JSON.php');
	
	header('Content-Type: application/json; charset=UTF-8');
	$json = new Services_JSON();
	$result = array();
	/*this.id = 0;
        this.type = 0;
        this.cate = 0;
        this.tags = '';
        this.amount = 0;
        this.remark = '';
        var now = +new Date;
        this.occurredTime = now;
        this.createTime = now;
        this.updateTime = now;*/
	$list = array();
	for($i=0;$i<10;$i++){
	$list[] = array(
	       id=>$i+1,
	       type=>0,
	       cate=>'饮食',
	       tags=>'KFC,午饭',
	       amount=>24,
	       remark=>'自己吃',
	       occurredTime=>'2011-8-13',
	       createTime=>'2011-8-13 23:23:23',
	       updateTime=>'2011-8-13 23:23:23'
	   );
	}
	
	$result[success] = 1;
	$result[result]['list'] = $list;
	print($json->encode($result));


?>
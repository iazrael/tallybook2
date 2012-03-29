#init tag
#insert into tag(SELECT id,name,createTime,updateTime,uid FROM category);

#init bill_tags 1
#insert into bill_tags(billId,tagId, createTime,uid) SELECT id as billId,categoryId as tagId,createTime ,uid FROM bill;

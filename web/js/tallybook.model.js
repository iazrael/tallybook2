Z.$package('tally.model', function(z){
    /**
     * @class
     * @name Bill
     */
    function Bill(){
        this.id = 0;
        this.type = 0;
        this.cate = 0;
        this.tags = '';
        this.amount = 0;
        this.remark = '';
        var now = +new Date;
        this.occurredTime = now;
        this.createTime = now;
        this.updateTime = now;
    };
    
    Bill.prototype = {
        toDataObject: function(){
            var object = {
                id: this.id,
                type: this.type,
                cate: this.cate,
                tags: this.tags,
                amount: this.amount,
                remark: this.remark,
                occurredTime: this.occurredTime
            };
            return object;
        },
        toJSONString: function(){
            return z.json.stringify(this.toDataObject());
        }
        
    };
    
    /**
     * 把后台返回的数据转换成一个Bill实例返回
     */
    Bill.parse = function(data){
        var bill = new Bill();
        bill.id = data.id;
        bill.type = data.type;
        bill.cate = data.cate;
        bill.tags = data.tags;
        bill.amount = data.amount;
        bill.remark = data.remark;
        bill.occurredTime = data.occurredTime;
        bill.createTime = data.createTime;
        bill.updateTime = data.updateTime;
        return bill;
    }
    
    /**
     * @class
     * @name BillList
     */
    function BillList(){
        this.list = [];
    };
    
    BillList.prototype = {
        add: function(bill){
            this.list.push(bill);
        },
        remove: function(bill){
            return z.array.remove(this.list, bill);
        },
        toDataObject: function(){
            var object = {
                list: this.list
            };
            return object;
        },
        toJSONString: function(){
            return z.json.stringify(this.toDataObject());
        }
    };
    
    BillList.parse = function(list){
        var billList = new BillList();
        var bill;
        for(var i in list){
            bill = Bill.parse(list[i]);
            billList.add(bill);
        }
        return billList;
    }
    
    this.Bill = Bill;
    this.BillList = BillList;
});

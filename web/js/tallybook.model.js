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
     * @class
     * @name BillList
     */
    function BillList(){
        this.list = [];
    };
    
    BillList.prototype = {
        add: function(bill){
            
        },
        remove: function(bill){
        
        },
        update: function(bill){
        
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
    
    this.Bill = Bill;
    this.BillList = BillList;
});

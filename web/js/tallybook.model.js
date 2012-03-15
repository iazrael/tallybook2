
;Z.$package('tally.model', function(z){


    var BaseModel = Z.$class({
        /**
         * @param  {String} prop  
         * 
         */
        setter: function(prop){
            var name = 'set' + prop;
            this[name] = function(value){
                var oldValue = this[prop];
                this[prop] = value;
                z.message.notify(this, name, { value: type, oldValue: oldType });
            }
        },
        /**
         * @param  {Array} props  
         * 
         */
        setters: function(obj, props){
            for (var i = 0; i < props.length; i++) {
                this.setter(props[i]);
            };
        },
        toDataObject: function(){
            var object = {
            };
            return object;
        },
        toJSONString: function(){
            JSON.stringify(this.toDataObject());
        }
    });


    /**
     * @class
     * @name Bill
     */
    var Bill = Z.$class({
        name: 'Bill'
    }, {
        init: function(){
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

            this.setters([
                'type',
                'cate',
                'tags',
                'amount',
                'remark',
                'occurredTime'
            ]);
        },
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
        }
    });
    
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
            return JSON.stringify(this.toDataObject());
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

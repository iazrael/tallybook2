
;Z.$package('tally.model', function(z){


    var BaseModel = Z.$class({
        /**
         * @param  {String} prop  
         * 
         */
        setter: function(prop, notifyContext){
            var name = 'set' + prop;
            this[name] = function(value){
                var oldValue = this[prop];
                this[prop] = value;
                z.message.notify(notifyContext || this, name, { value: type, oldValue: oldType });
            }
        },
        /**
         * @param  {Array} props  
         * 
         */
        setters: function(obj, props, notifyContext){
            for (var i = 0; i < props.length; i++) {
                this.setter(props[i], notifyContext);
            };
        }
    });


    /**
     * @class
     * @name Bill
     */
    var Bill = Z.$class({
        name: 'Bill',
        extend: BaseModel
    }, {
        init: function(option){
            option = option || {};
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
            ], option.notifyContext);
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
        },
        toJSONString: function(){
            JSON.stringify(this.toDataObject());
        }
    });
    
    
    var BillList = z.$class({
        name: 'BillList',
        extend: z.class.Collection
    }, {
        init: function(option){
            
        }
    })
    
    this.Bill = Bill;
    this.BillList = BillList;
});

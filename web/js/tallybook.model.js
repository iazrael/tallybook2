
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
    var Bill = this.Bill = Z.$class({
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
    
    /**
     * @class
     * @name Category
     */
    var Category = this.Category = Z.$class({
        name: 'Category',
        extend: BaseModel
    }, {
        init: function(option){
            option = option || {};
            this.id = 0;
            this.name = '';
            this.children = [];
            this.setters([
                'name'
            ], option.notifyContext);
        },
        toDataObject: function(){
            var object = {
                id: this.id,
                name: this.name
            };
            return object;
        },
        toJSONString: function(){
            JSON.stringify(this.toDataObject());
        }
    });

    /**
     * @class
     * @name Tag
     */
    var Tag = this.Tag = Z.$class({
        name: 'Tag',
        extend: BaseModel
    }, {
        init: function(option){
            option = option || {};
            this.id = 0;
            this.name = '';
            this.frequency = 0;
            this.setters([
                'name',
                'frequency'
            ], option.notifyContext);
        },
        toDataObject: function(){
            var object = {
                id: this.id,
                name: this.name
            };
            return object;
        },
        toJSONString: function(){
            JSON.stringify(this.toDataObject());
        }
    });
    
    var List = z.$class({
        name: 'List',
        extend: z.util.Collection
    }, {
        init: function(option){
            
        },
        //把get改成根据key取数据的方式
        get: function(key){
            return this.getByKey(key);
        },
        remove: function(key){
            return this.removeByKey(key);
        }
    });

    var BillList = this.BillList = z.$class({
        name: 'BillList',
        extend: List
    }, {
    });

    var CategoryList = this.CategoryList = z.$class({
        name: 'CategoryList',
        extend: List
    }, {
    });

    var TagList = this.TagList = z.$class({
        name: 'TagList',
        extend: List
    }, {
    });
    
});

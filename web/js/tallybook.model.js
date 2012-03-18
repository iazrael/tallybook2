
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
    
    var BillList = this.BillList = z.$class({
        name: 'BillList',
        extend: z.util.Collection
    }, {
        init: function(option){
            
        }
    });

    var CategoryList = this.CategoryList = z.$class({
        name: 'CategoryList',
        extend: z.util.Collection
    }, {
        init: function(option){
            this._parents = [];
        },
        getByKey: function(key){
            return this._map[key];
        },
        getByIndex: function(index){
            return this._arr[index];
        },
        getIndexByKey: function(key, keyName){
            keyName = keyName || this._keyName;
            var item = this._map[key];
            if(item){
                for(var i in this._arr){
                    if(this._arr[i][keyName] == key){
                        return i;
                    }
                }
            }
            return null;
        },
        getKeyByIndex: function(index, keyName){
            keyName = keyName || this._keyName;
            var item = this.getByIndex(index);
            if(item){
                return item[keyName];
            }
            return null;
        },
        /**
         * 根据key的类型自动判断使用
         * string getByKey
         * number getByIndex
         */
        get: function(key){
            if(z.isString(key)){
                return this.getByKey(key);
            }else{
                return this.getByIndex(key);
            }
        },
        getRange: function(start, count){
            var end = start + count;
            return this._arr.slice(start, end);
        },
        filter: function(key, value){
            var result = [];
            for(var i in this._arr){
                if(this._arr[i][key] == value){
                    result.push(this._arr[i]);
                }
            }
            return result;
        },
        add: function(item, index){
            var existItem = this._map[item[this._keyName]];
            if(existItem){
                return false;
            }
            this._map[item[this._keyName]] = item;
            if(typeof(index) == 'undefined'){
                this._arr.push(item);
            }else{
                this._arr.splice(index, 0, item);
            }
            z.message.notify(this, 'add', {
                item: item,
                index: index
            });
            return true;
        },
        /**
         * 批量添加, 如果有 key 一样的会排出掉
         */
        addRange: function(items, index){
            var newItems = [], item, keyName = this._keyName;
            for(var i in items){
                item = items[i];
                if(!this._map[item[keyName]]){
                    newItems.push(item);
                    this._map[item[keyName]] = item;
                }
            }
            if(!newItems.length){
                return false;
            }
            if(typeof(index) == 'undefined'){
                this._arr = this._arr.concat(newItems);
            }else{
                var param = [index, 0].concat(newItems);
                Array.prototype.splice.apply(this._arr, param);
            }
            z.message.notify(this, 'addRange', {
                items: newItems,
                index: index
            });
            return true;
        },
        removeByKey: function(key, noEvent){
            var item = this._map[key];
            if(item){
                var index = this.getIndexByKey(key);
                this._arr.splice(index, 1);
                if(!noEvent){
                    z.message.notify(this, 'remove', {
                        items: item,
                        index: index,
                        key: key
                    });
                }
                return true;
            }
            return false;
        },
        removeByIndex: function(index, noEvent){
            var item = this._arr[index];
            if(item){
                this._arr.splice(index, 1);
                this._map[item[this._keyName]] = null;
                if(!noEvent){
                    z.message.notify(this, 'remove', {
                        items: item,
                        index: index,
                        key: item[this._keyName]
                    });
                }
                return true;
            }
            return false;
        },
        /**
         * 根据key的类型自动判断使用
         * string removeByKey
         * number removeByIndex
         */
        remove: function(key){
            if(J.isString(key)){
                return this.removeByKey(key);
            }else{
                return this.removeByIndex(key);
            }
        },
        removeRange: function(items){
            var removedItems = [], item, keyName = this._keyName;
            for(var i in items){
                item = items[i];
                if(this.removeByKey(item[keyName])){
                    removedItems.push(item);
                }
            }
            if(!removedItems.length){
                return false;
            }
            z.message.notify(this, 'removeRange', {
                items: removedItems
            });
            return true;
        },
        length: function(){
            return this._arr.length;
        },
        clear: function(){
            var items = this._arr;
            this._arr = [];
            this._map = {};
            z.message.notify(this, 'clear', {
                items: items
            });
        },
        getFirst: function() {
            return this.get(0);
        },
        getLast: function() {
            return this.get(this.length() - 1);
        }
    });

    var TagList = this.TagList = z.$class({
        name: 'TagList',
        extend: z.util.Collection
    }, {
        init: function(option){
            
        }
    });
    
});

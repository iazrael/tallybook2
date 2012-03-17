
;(function(undefined){
    var PACKAGE_STATUS = {
        UNDEFINED: 0,
        BUILDED: 1,
        LOADED: 2,
        INITED: 3
    };
    var LIBRARY_NAME = 'Z';
    
    var packageList = {};
    var dependenceQueue = {};
    
    var emptyFunction = function(){};
    
    var isDebuging = 0;
    
    var debug = isDebuging ? (window.console ? function(data){
        console.debug ? console.debug(data) : console.log(data);
    } : emptyFunction) : emptyFunction;
       
    /**
     * @param {String} packageName
     */
    var buildPackage = function(packageName){
        var pack = packageList[packageName];
        if(!pack){
            pack = window;
            var nameList = packageName.split('.');
            for(var i in nameList){
                if(!(nameList[i] in pack)){
                    pack[nameList[i]] = {};
                }
                pack = pack[nameList[i]];
            }
            packageList[packageName] = pack;
        }
        if(!('packageName' in pack)){
            pack.packageName = packageName;
        }
        if(!('packageStatus' in pack)){
            pack.packageStatus = PACKAGE_STATUS.BUILDED;
        }
        debug('buildPackage: ' + packageName);
        return pack;
    };
    
    var getPackage = function(packageName){
        if(packageList[packageName]){
            return packageList[packageName];
        }
        var nameList = packageName.split('.');
        var pack = window;
        for(var i in nameList){
            if(!(nameList[i] in pack)){
                return undefined;
            }
            pack = pack[nameList[i]];
        }
        return pack;
    };
    
    var getPackageStatus = function(packageName){
        var pack = getPackage(packageName);
        var status = pack ? pack.packageStatus : PACKAGE_STATUS.UNDEFINED;
        return status;
    };
    
    var initPackage = function(pack, requirePackages, constructor){
        if(typeof pack === 'string'){
            pack = getPackage(pack);
        }
        var require = {};
        var library = getPackage(LIBRARY_NAME);
        if(requirePackages){
            for(var r in requirePackages){
                require[r] = getPackage(requirePackages[r]);
            }
        }
        debug('initPackage: ' + pack.packageName);
        if(constructor){
            constructor.call(pack, library, require);
            debug('[[' + pack.packageName + ' inited]]');
        }
        pack.packageStatus = PACKAGE_STATUS.INITED;
        runDependenceQueue(pack.packageName);
    };
    
    var checkDependence = function(requirePackages){
        if(!requirePackages){
            return true;
        }
        var requirePackageName;
        for(var r in requirePackages){
            requirePackageName = requirePackages[r];
            if(getPackageStatus(requirePackageName) !== PACKAGE_STATUS.INITED){
                return false;
            }
        }
        return true;
    };
    
    var addToDependenceQueue = function(packageName, requirePackages, constructor){
        debug('>>>addToDependenceQueue, package: ' + packageName);
        var requirePackageName;
        for(var r in requirePackages){
            requirePackageName = requirePackages[r];
            if(!dependenceQueue[requirePackageName]){
                dependenceQueue[requirePackageName] = [];
            }
            dependenceQueue[requirePackageName].push({
                packageName: packageName, 
                requirePackages: requirePackages, 
                constructor: constructor
            });
        }
    };
    
    var runDependenceQueue = function(packageName){
        var requireQueue = dependenceQueue[packageName];
        if(!requireQueue){
            return false;
        }
        debug('<<<runDependenceQueue, dependented package: ' + packageName);
        var flag = false, require;
        for(var r = 0; r < requireQueue.length; r++ ){
            require = requireQueue[r];
            if(checkDependence(require.requirePackages)){
                flag = true;
                initPackage(require.packageName, require.requirePackages, require.constructor);
            }
        }
        delete dependenceQueue[packageName];
        return flag;
    };
    
    /**
     * @param {String} packageName
     * @param {Object} requirePackages for 异步按需加载各种依赖模块
     * { shortName: packageName } or [packageName]
     * @param {Function} constructor
     * @example 
     *  Z.$package('Z.test', function(z){
        });
        Z.$package('Z.test.test1', {
            t: 'Z.test2',
            u: 'Z.util',
            o: 'Z.tools'
        }, function(z, d){
            console.log(d.t);
        });
        Z.$package('Z.test2', function(z){
            console.log(11111111);
        });
        Z.$package('Z.test2', function(z){
            console.log(22222222);
        });
        Z.$package('Z.util', {
            t: 'Z.tools'
        }, function(z){
        });
        Z.$package('Z.tools',function(z){
        });
     */
    var $package = function(){
        var packageName, requirePackages,  constructor;
        packageName = arguments[0];
        if(arguments.length === 3){
            requirePackages = arguments[1];
            constructor = arguments[2];
        }else{
            constructor = arguments[1];
        }
        var pack = buildPackage(packageName);
        if(pack.packageStatus === PACKAGE_STATUS.BUILDED){
            pack.packageStatus = PACKAGE_STATUS.LOADED;
        }
        if(requirePackages && !checkDependence(requirePackages)){
            addToDependenceQueue(packageName, requirePackages, constructor);
        }else{
            initPackage(pack, requirePackages, constructor);
        }
    };
    
    /**
     * init the library
     */
    $package(LIBRARY_NAME, function(z){
        z.debug = debug;
        
        z.PACKAGE_STATUS = PACKAGE_STATUS;
        z.$package = $package;
        z.getPackage = getPackage;
        z.getPackageStatus = getPackageStatus;
        
    });
    
})();/**
 * 一些最基本的方法, 提供简单的访问方式
 */
;Z.$package('Z', function(z){
    
    var toString = Object.prototype.toString;
    
    this.isString = function(obj){
        return toString.call(obj) === '[object String]';
    }
    
    this.isArray = function(obj){
        return Array.isArray ? Array.isArray(obj) : toString.call(obj) === '[object Array]';
    }
    
    this.isArguments = function(obj){
        return toString.call(obj) === '[object Arguments]';
    }
    
    this.isObject = function(obj){
        return toString.call(obj) === '[object Object]';
    }
    
    this.isFunction = function(obj){
        return toString.call(obj) === '[object Function]';
    }
    
    this.isUndefined = function(obj){
        return toString.call(obj) === '[object Undefined]';
    }
    
    
});
;Z.$package('Z', function(z){
    
    var emptyFunction = function(){};

    /**
	 * 合并几个对象并返回 baseObj,
     * 如果 extendObj 有数组属性, 则直接拷贝引用
     * @param {Object} baseObj 基础对象
     * @param {Object} extendObj ... 
     * 
     * @return {Object} a new baseObj
     * 
	 **/
    var merge = function(baseObj, extendObj1, extendObj2/*, extnedObj3...*/){
        var argu = arguments;
        var extendObj;
        for(var i = 1; i < argu.length; i++){
            extendObj = argu[i];
            for(var j in extendObj){
                if(z.isArray(extendObj[j])){
                    baseObj[j] = extendObj[j].concat();
                }else if(z.isObject(extendObj[j])){
                    if(baseObj[j] && z.isArray(baseObj[j])){
                    //避免给数组做 merge
                        baseObj[j] = merge({}, extendObj[j]);
                    }else{
                        baseObj[j] = merge({}, baseObj[j], extendObj[j]);
                    }
                }else{
                    baseObj[j] = extendObj[j];
                }
            }
        }
        return baseObj;
    }
    
    /**
     * 把传入的对象或数组或者参数对象(arguments)复制一份
     * @param {Object}, {Array}
     * @return {Object}, {Array} 一个新的对象或数组
     */
    var duplicate = function(obj){
        if(z.isArray(obj)){
            return obj.concat();
        }else if(z.isArguments(obj)){
            var result = [];
            for(var a = 0, p; p = obj[a]; a++){
                result.push(duplicate(p));
            }
            return result;
        }else if(z.isObject(obj)){
            return merge({}, obj);
        }else{
            throw new Error('the argument isn\'t an object or array');
        }
    }
    
    /**
	 * 定义类
	 * @param {Object} option , 可指定 extend 和 implements, statics
     * {extend: {Class}, //继承的父类
     * implements: [{Interface}],//所实现的接口
     * name: {String}, //类名
     * statics: {{String}: {Function}||{Object}},//定义的静态变量和方法
     * }
     * 
	 * @param {Object} prototype, 原型链, 必须要有 init 方法
	 **/
    var defineClass = function(option, prototype){
        if(arguments.length === 1){
            prototype = option;
            option = {};
        }
        if(typeof(prototype.init) !== 'function'){
            // throw new Error('a class must have a "init" method');
           // 没有的 init 方法的时候指定一个空的
           prototype.init = emptyFunction;
        }
        var newClass = function(){
            return this.init.apply(this, arguments);
        };
        var superClass = option.extend;
        if(superClass){
            if(isInterface(superClass)){
                throw new Error('can not extend a interface!');
            }
            var superInit = superClass.prototype.init;
            var thisInit = prototype.init;//释放传入 prototype 变量的引用, 以便内存回收
            var superPrototype = duplicate(superClass.prototype);
            delete superPrototype.init;
            var newPrototype = newClass.prototype = merge({}, superClass.prototype, prototype);
            newClass.prototype.init = function(){
                this.$static = newClass;//提供更快速的访问 类方法的途径
                var argus = duplicate(arguments);
                superInit.apply(this, argus);
                argus = duplicate(arguments);
                thisInit.apply(this, argus);
                //把父类被重写的方法赋给子类实例
                var that = this;
                this.$super = {};//TODO 这里有问题, 不能向上找父类的父类
                for(var prop in superPrototype){
                    if(z.isFunction(superPrototype[prop]) && newPrototype[prop]){//子类重写了的方法, 才覆盖
                        this.$super[prop] = (function(prop){
                            return function(){
                                superPrototype[prop].apply(that, arguments);
                            }
                        })(prop);
                    }
                }
            }
        }else{
            var thisInit = prototype.init;
            newClass.prototype = prototype;
            newClass.prototype.init = function(){
                this.$static = newClass;//提供更快速的访问 类方法的途径
                var argus = arguments;
                thisInit.apply(this, argus);
            }
        }
        newClass.type = 'class';
        newClass.className = option.name || 'anonymous';
        var impls = option['implements'];
        if(impls){
            var unImplMethods = [], implCheckResult;
            for(var i in impls){
                implCheckResult = impls[i].checkImplements(newClass.prototype);
                unImplMethods = unImplMethods.concat(implCheckResult);
            }
            if(unImplMethods.length){
                throw new Error('the \'' + newClass.className + '\' class hasn\'t implemented the interfaces\'s methods . [' + unImplMethods + ']');
            }
        }
        if(option.statics){
            merge(newClass, option.statics);
        }
        return newClass;
    }
    
    /**
	 * 判断传入类是否是接口
	 **/
    var isInterface = function(cls){
        if(cls.type === 'interface' && z.isArray(cls.methods) && z.isFunction(cls.checkImplements)){
            return true;
        }
        return false;
    }
    
	/**
	 * 定义接口
	 **/
    var defineInterface = function(option, methods){
        if(arguments.length === 1){
            methods = option;
            option = {};
        }
        var newInterface = function(){
            throw new Error('the interface can not be Instantiated!');
        }
        newInterface.type = 'interface'
        newInterface.interfaceName = option.name || 'anonymous';
        newInterface.methods = methods;
        newInterface.checkImplements = function(instance){
            var unImplMethods = [], impl;
            for(var i in methods){
                impl = instance[methods[i]];
                if(!impl || typeof(impl) !== 'function'){
                    unImplMethods.push(methods[i]);
                }
            }
            return unImplMethods;
        }
        return newInterface;
    }
    
    /**
	 * 定义类或接口
     * @example
     *  var A = define('class', {
            name: 'classA'
        }, {
            init: function(){
                console.log('A init');
            },
            alertA: function(){
                alert('A');
            }
        });
        
        var B = define('class', { extend: A , statics: {
            kill: function(){
                alert('kill B');
            }
            
        }}, {
            init: function(){
                console.log('B init');
            },
            alertB: function(){
                alert('B');
            }
        });
        
        var C = define('interface', [
            'foo',
            'bar'
        ]);
        
        var D = define('class', { extend: B, 'implements': [ C ]}, {
            init: function(){
                console.log('D init');
            },
            foo: function(){
                console.log('foooooo');
            },
            bar: function(){
            }
        });
     *
	 **/
    var define = function(type, option, prototype){
        var args = Array.prototype.slice.call(arguments, 1);
        if(type === 'class'){
            return defineClass.apply(this, args);
        }else if(type === 'interface'){
            return defineInterface.apply(this, args);
        }
        
    }
    
    this.merge = merge;
    this.duplicate = duplicate;
    this.define = define;
    
    this.$class = defineClass;
    this.$interface = defineInterface;
    
    /* //test code
    var A = define('class', {
        init: function(option){
            console.log('A init');
            console.log(arguments);
        },
        alertA: function(){
            alert('A');
        },
        foo: function(){
            console.log('a foo');
        }
    });
    
    var B = define('class', { extend: A , statics: {
        kill: function(){
            alert('kill B');
        }
        
    }}, {
        init: function(option){
            console.log('B init');
            option.b='c';
        },
        alertB: function(){
            alert('B');
        },
        bar: function(){
            console.log('b bar');
        },
        foo: function(){
            console.log('b foo');
        }
    });
    
    var C = define('interface', [
        'foo',
        'bar'
    ]);
    
    var D = define('class', { extend: B, 'implements': [ C ]}, {
        init: function(){
            console.log('D init');
            console.log(arguments);
        },
        foo: function(){
            console.log('foooooo');
        },
        bar: function(){
        }
    });
    
    // var a = new A();
    // console.log(a);
    // console.log(a.constructor);
    
    // var b = new B();
    // console.log(b);
    // console.log(b.constructor);
//    console.log(B);
    var d = new D({'a': 123});
//    console.log(D);
    console.log(d);
    console.log(d.constructor); */
});/**
 * @namespace Z.message
 * zTool 使用全局的消息通知机制, 需要监听消息的模块调用addListener注册一个回调函数,
 * 当有指定消息到达时触发
 */
;Z.$package('Z.message', function(z) {
    var IE_CUSTOM_EVENT = 'onpropertychange';
    var IE_EVENT_ELEMENT_STYLE = 'position: absolute; top: -9999em; left: -9999em; width: 0px; height: 0px;';

    var eventElement;

    var getEventElement = function() {
        if (!eventElement) {
            eventElement = document.createElement('div');
            if (!document.createEvent) {
                eventElement.style.cssText = IE_EVENT_ELEMENT_STYLE;
                document.body.appendChild(eventElement);
            }
        }
        return eventElement;
    }

    /**
     * 添加事件监听
     * @param {Object} model 消息的挂载目标, 可选, 默认为 window
     * @param {String} type 消息类型
     * @param {Function} func 监听函数
     * func 的调用参数为 ({String}: type, {Object}: message)
     */
    var addListener = function(model, type, func) {
        var listener;
        var wrapFunc;
        var element;
        var liteners;
        if (arguments.length === 2) {
            func = type;
            type = model;
            model = window;
        }
        if (!model.__liteners) {
            model.__liteners = {};
        }
        liteners = model.__liteners;
        if (!liteners[type]) {
            liteners[type] = [];
        } else {
            for (var i in liteners[type]) {
                listener = liteners[type][i];
                if (listener.func === func) {
                    return false;
                }
            }
        }
        element = getEventElement();
        if (element.addEventListener) {
            wrapFunc = function(e) {
                func.apply(window, e.params);
            }
            element.addEventListener(type, wrapFunc, false);
        } else {
            wrapFunc = function(e) {
                e = window.event;
                //TODO ie8及以下的浏览器后绑定的方法先执行, 导致触发的事件执行顺序倒过来了
                //没精力去自己实现顺序执行, 先这样吧
                if (type === e.params[1]) {
                    func.apply(window, e.params);
                }
            }
            element.attachEvent(IE_CUSTOM_EVENT, wrapFunc);
        }
        listener = {
            func: func,
            wrapFunc: wrapFunc
        };
        liteners[type].push(listener);
        return true;
    }
    /**
     * 移除事件监听
     * @param {Object} model 消息的挂载目标, 可选, 默认为 window
     * @param {String} type
     * @param {Function} func 监听函数, 如果不指定, 则移除所有这个类型的监听函数
     */
    var removeListener = function(model, type, func) {
        var listener;
        var element;
        var listeners;
        if (arguments.length === 2) {
            func = type;
            type = model;
            model = window;
        }
        listeners = model.__liteners;
        if (!listeners || !listeners[type]) {
            return false;
        }
        element = getEventElement();
        if (!func) {
            for (var i in listeners[type]) {
                listener = listeners[type][i];
                if (element.removeEventListener) {
                    element.removeEventListener(type, listener.wrapFunc, false);
                } else {
                    element.detachEvent(IE_CUSTOM_EVENT, listener.wrapFunc);
                }
            }
            listeners[type] = null;
            delete listeners[type];
            return true;
        }
        for (var i in listeners[type]) {
            listener = listeners[type][i];
            if (listener.func === func) {
                listeners[type].slice(i, 1);
                if (element.removeEventListener) {
                    element.removeEventListener(type, listener.wrapFunc, false);
                } else {
                    element.detachEvent(IE_CUSTOM_EVENT, listener.wrapFunc);
                }
                return true;
            }
        }
        return false;
    }

    /** 
     * 向消息的监听者广播一条消息
     * @param {Object} model 消息的挂载目标, 可选, 默认为 window
     * @param {String} type ,消息类型
     * @param {Object} message, 消息体
     * @example
     * var func1 = function(type, message){
            console.log('help!!!!! don\t kill me ..... call 110.');
            throw '110';
        }
        
        z.message.on('kill', func1);
        
        z.message.on('kill', function(type, message){
            console.log('ok, i m dead.');
            
        });
        
        //notify it
        z.message.notify('kill')
     *
     */
    var notify = function(model, type, message) {
        var element;
        var event;
        var listeners;
        z.debug('notify message: ' + type);
        if (arguments.length === 2) {
            message = type;
            type = model;
            model = window;
        }
        listeners = model.__liteners;
        if (!listeners || !listeners[type]) {
            return false;
        }

        element = getEventElement();
        if (document.createEvent) {
            event = document.createEvent('Events');
            event.initEvent(type, false, false);
            event.params = [message, type];
            element.dispatchEvent(event);
        } else {
            event = document.createEventObject(IE_CUSTOM_EVENT);
            event.params = [message, type];
            element.fireEvent(IE_CUSTOM_EVENT, event);
        }
        return listeners[type].length !== 0;
    }

    this.addListener = addListener;
    this.on = addListener;
    this.removeListener = removeListener;
    this.off = removeListener;
    this.notify = notify;
});

;Z.$package('Z.dom', function(z){
    
    var packageContext = this;

    /**
     * shot of getElementById
     */
    this.get = function(id){
        return document.getElementById(id);
    }
    
    var templateList = {};
    
    /**
     * 获取页面的一个 html 模板
     * @param {String} tmplId 模板的 dom id
     */
    this.getTemplate = function(tmplId){
        var tmpl = templateList[tmplId];
        if(!tmpl){
            var tmplNode = this.get(tmplId);
            tmpl = tmplNode.innerHTML;
            tmplNode.parentNode.removeChild(tmplNode);
            templateList[tmplId] = tmpl;
        }
        if(!tmpl){
            throw new Error('no such template. [id="' + tmplId + '"]');
        }
        return tmpl;
    }
    
    /**
     * 获取点击的事件源, 该事件源是有 cmd 属性的 默认从 event.target 往上找三层,找不到就返回null
     * 
     * @param {Event}
     *            event
     * @param {Int}
     *            level 指定寻找的层次
     * @param {String}
     *            property 查找具有特定属性的target,默认为cmd
     * @param {HTMLElement} parent 指定查找结束点, 默认为document.body
     * @return {HTMLElement} | null
     */
    this.getActionTarget = function(event, level, property, parent){
        var t = event.target,
            l = level || 3,
            s = level !== -1,
            p = property || 'cmd',
            end = parent || document.body;
        while(t && (t !== end) && (s ? (l-- > 0) : true)){
            if(t.getAttribute(p)){
                return t;
            }else{
                t = t.parentNode;
            }
        }
        return null;
    }
    
    /**
     *  @param {HTMLElement},{String} targetId, target dom or dom id
     *  @param {String} tmplId, template dom id
     *  @param {Object} data
     *  @param {Boolean} isPlus, add or replace
     */
    this.render = function(target, tmplId, data, isPlus){
        var tabTmpl = this.getTemplate(tmplId);
        var html = z.string.template(tabTmpl, data);
        if(typeof target === 'string'){
            target = this.get(target);
        }
        if(isPlus && target.childElementCount){
            var tempNode = document.createElement('div');
            tempNode.innerHTML = html;
            var nodes = tempNode.children;
            var fragment = document.createDocumentFragment();
            while(nodes[0]){
                fragment.appendChild(nodes[0]);
            }
            target.appendChild(fragment);
            delete tempNode;
        }else{
            target.innerHTML = html;
        }
    }
    
    /**
     * @example
     * bindCommends(cmds);
     * bindCommends(el, cmds);
     * bindCommends(el, 'click', cmds);
     * 
     * function(param, target, event){
     * }
     */
    this.bindCommends = function(targetElement, eventName, commends){
        var defaultEvent = 'click';
        if(arguments.length === 1){
            commends = targetElement;
            targetElement = document.body;
            eventName = defaultEvent;
        }else if(arguments.length === 2){
            commends = eventName;
            eventName = defaultEvent;
        }
        if(targetElement.__commends){//已经有commends 就合并
            z.merge(targetElement.__commends, commends);
            return;
        }
        targetElement.__commends = commends;
        targetElement.addEventListener(eventName, function(e){
            var target = packageContext.getActionTarget(e, 3, 'cmd', this);
            if(target){
                var cmd = target.getAttribute('cmd');
                var param = target.getAttribute('param');
                if(target.href && target.getAttribute('href').indexOf('#') === 0){
                    e.preventDefault();
                }
                if(this.__commends[cmd]){
                    this.__commends[cmd](param, target, e);
                }
            }
        });
    }
    
});

;Z.$package('Z.string', function(z){
    
    /**
     * 
     * @param {Object} obj 要转换成查询字符串的对象
     * @return {String} 返回转换后的查询字符串
     */
    var toQueryPair = function(key, value) {
        return encodeURIComponent(String(key)) + "=" + encodeURIComponent(String(value));
    };
    
    /**
     * 
     * @param {Object} obj 要转换成查询字符串的对象
     * @return {String} 返回转换后的查询字符串
     */
    this.toQueryString = function(obj){
        var result=[];
        for(var key in obj){
            result.push(toQueryPair(key, obj[key]));
        }
        return result.join("&");
    };
    
    var templateCache = {};
      
    /**
     * 多行或单行字符串模板处理
     * 
     * @method template
     * @memberOf string
     * 
     * @param {String} str 模板字符串
     * @param {Object} obj 要套入的数据对象
     * @return {String} 返回与数据对象合成后的字符串
     * 
     * @example
     * <script type="text/html" id="user_tmpl">
     *   <% for ( var i = 0; i < users.length; i++ ) { %>
     *     <li><a href="<%=users[i].url%>"><%=users[i].name%></a></li>
     *   <% } %>
     * </script>
     * 
     * Jx().$package(function(J){
     *  // 用 obj 对象的数据合并到字符串模板中
     *  J.template("Hello, {name}!", {
     *      name:"Kinvix"
     *  });
     * };
     */
    this.template = function(str, data){
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = !/\W/.test(str) ?
          templateCache[str] = templateCache[str] ||
            template(document.getElementById(str).innerHTML) :
          
          // Generate a reusable function that will serve as a template
          // generator (and which will be cached).
          new Function("obj",
            "var z_tmp=[],print=function(){z_tmp.push.apply(z_tmp,arguments);};" +
            
            // Introduce the data as local variables using with(){}
            "with(obj){z_tmp.push('" +
            
            // Convert the template into pure JavaScript
            str
              .replace(/[\r\t\n]/g, " ")
              .split("<%").join("\t")
              .replace(/((^|%>)[^\t]*)'/g, "$1\r")
              .replace(/\t=(.*?)%>/g, "',$1,'")
              .split("\t").join("');")
              .split("%>").join("z_tmp.push('")
              .split("\r").join("\\'")
          + "');}return z_tmp.join('');");
        
        // Provide some basic currying to the user
        return data ? fn( data ) : fn;
    };
    
});
/**
 * 节拍器, 节省设置多个setIntervel带来的性能消耗
 * 最长节拍是一分钟
 * 节拍的起点未必完全正确, 节拍越长, 起点的误差会越大
 * 不能用于节拍间距比较长(大于一分钟的那种)并且要求精度比较高的情况
 * 一秒内的情况比较好用
 */
;Z.$package('Z.class', ['Z.message'], function(z){
    
    this.Beater = z.$class({
        name: 'Beater',
        statics: {
            DEFAULT_INTERVAL: 50,
            DEFAULT_MAX_INTERVAL: 60 * 1000
        }
    }, {
        init: function(option){
            option = option || {};
            this._triggers = {};
            this._beaters = {};
            this._isStart = false;
            this._autoStart = ('autoStart' in option) ? option.autoStart : true;
            this._interval = option.interval || this.$static.DEFAULT_INTERVAL;
            //maxInterval 是为了防止timecount会一直无限增上去
            this._maxInterval = option.maxInterval || this.$static.DEFAULT_MAX_INTERVAL;
        },
        checkBeater: function(){
            var count = 0;
            for(var i in this._beaters){
                count += this._beaters[i];
            }
            return !!count;
        },
        add: function(bid, time, func){
        	
        	if(time % this._interval){
        		//time 不能整除
        		time = Math.round(time / this._interval) * this._interval;
        	}else if(time < this._interval){//不能小于
                time = this._interval;
            }else if(time > this._maxInterval){
                time = this._maxInterval;
            }
            
            if(this._triggers[bid]){
                throw new Error('beater is exist');
                return false;
            }
            var event = 'Beater-' + time;
            this._beaters[time] = this._beaters[time] || 0;
            this._triggers[bid] = {
                time: time,
                func: func
            };
            z.message.on(this, event, func);
            this._beaters[time]++;
            if(!this._isStart && this._autoStart){
                this.start();
            }
            return true;
        },
        remove: function(bid){
            var trigger = this._triggers[bid];
            if(!trigger){
                return false;
            }
            var event = 'Beater-' + trigger.time;
            this._beaters[trigger.time]--;
            this._triggers[bid] = null;
            delete this._triggers[bid];
            z.message.off(this, event, trigger.func);
            if(!this.checkBeater()){
                this.stop();
            }
            return true;
        },
        start: function(){
            if(this._isStart){
                return false;
            }
            var context = this;
            var timeCount = 0, interval = this._interval;
            this._timer = setInterval(function(){
                timeCount += interval;
                if(timeCount >= context._maxInterval){
                    timeCount = 0;
                }
                var inter;
                for(var i in context._beaters){
                	if(!context._beaters[i]){
                		//这下面没有挂 beater
                		continue;
                	}
                	inter = Number(i);
                	if(!(timeCount % inter)){
                        z.message.notify(context, 'Beater-' + inter, {time: inter});
                    }
                }
                
            }, interval);
            this._isStart = true;
            return true;
        },
        stop: function(){
            if(!this._isStart){
                return false;
            }
            clearInterval(this._timer);
            this._timer = 0;
            this._isStart = false;
            return true;
        }
    });
    
});

;Z.$package('Z.class', ['Z.message'], function(z){
    
    /**
     * 通用 collection 类
     */
    this.Collection = new z.$class({
        name: 'Collection'
    }, {
        init: function(option){
            option = option || {};
            this._keyName = option.keyName || 'id';
            this._arr = [];
            this._map = {};
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
    
});
/**
 * setTimout 的封装, 用于处理输入检测等触发过快的事件/方法
 */
;Z.$package('Z.util', function(z){
    
    var DELAY_STATUS = {
        NORMAL: 0,
        ID_EXIST: 1,
        ID_NOT_EXIST: 2
    };

    var timerList = {};
    /**
     * @param {String} id @optional
     * @param {Number} time @optional
     * @param {Function} func
     * @param {Function} onClearFunc @optional
     * @example
     * 1. delay('id01', 1000, func)
     * 2. delay(1000, func)
     * 3. delay(func) === delay(0, func)
     */
    this.delay = function(id, time, func, onClearFunc/*TODO 未实现*/){
        var argu = arguments;
        var flag = DELAY_STATUS.NORMAL;
        if(argu.length === 1){
            func = id;
            time = 0;
            id = null;
        }else if(argu.length === 2){
            func = time;
            time = id;
            id = null;
        }
        time = time || 0;
        if(id && time){
            if(id in timerList){
                window.clearTimeout(timerList[id]);
                flag = DELAY_STATUS.ID_EXIST;
            }
            var wrapFunc = function(){
                func.apply(window, [id]);
                timerList[id] = 0;
                delete timerList[id];
            };
            var timer = window.setTimeout(wrapFunc, time);
            timerList[id] = timer;
        }else{
            window.setTimeout(func, time);
        }
        return flag;
    }
    
    this.clearDelay = function(id){
        if(id in timerList){
            window.clearTimeout(timerList[id]);
            timerList[id] = 0;
            delete timerList[id];
            return DELAY_STATUS.NORMAL;
        }
        return DELAY_STATUS.ID_NOT_EXIST;
    }
    
    var intervalerList = {};
    
    /**
     * 定时循环执行传入的func
     */
    this.loop = function(id, time, func){
        var argu = arguments;
        var flag = DELAY_STATUS.NORMAL;
        if(argu.length == 2){
            func = time;
            time = id;
        }
        time = time || 0;
        if(id && time){
            if(id in intervalerList){
                window.clearInterval(intervalerList[id]);
                flag = DELAY_STATUS.ID_EXIST;
            }
            var wrapFunc = function(){
                func.apply(window, [id]);
            };
            var intervaler = window.setInterval(wrapFunc, time);
            intervalerList[id] = intervaler;
        }else{
            setInterval(func, time);
        }
        return flag;
    }
    
    this.clearLoop = function(id){
        if(id in intervalerList){
            window.clearInterval(intervalerList[id]);
            intervalerList[id] = 0;
            delete intervalerList[id];
            return DELAY_STATUS.NORMAL;
        }
        return DELAY_STATUS.ID_NOT_EXIST;
    }
    
});
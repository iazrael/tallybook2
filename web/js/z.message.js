/**
 * @namespace Z.message
 * zTool 使用全局的消息通知机制, 需要监听消息的模块调用addListener注册一个回调函数,
 * 当有指定消息到达时触发
 */
;Z.$package('Z.message', function(z){
    
    var listenerList = {};
    
    /**
     * 添加事件监听
     * @param {String} type 消息类型
     * @param {Function} func 监听函数
     * func 的调用参数为 ({String}: type, {Object}: message)
     */
    var addListener = function(type, func){
        if(!listenerList[type]){
            listenerList[type] = [];
        }else{
            for(var i in listenerList[type]){
                if(listenerList[type][i] === func){
                    return false;
                }
            }
        }
        listenerList[type].push(func);
        return true;
    }
    /**
     * 移除事件监听
     * @param {String} type
     * @param {Function} func 监听函数, 如果不指定, 则移除所有这个类型的监听函数
     */
    var removeListener = function(type, func){
        if(!listenerList[type]){
            return false;
        }
        if(!func){
            listenerList[type] = null;
            delete listenerList[type];
        }else{
            for(var i in listenerList[type]){
                if(listenerList[type][i] === func){
                    listenerList[type].slice(i, 1);
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * 向消息的监听者广播一条消息
     * @param {String} type ,消息类型
     * @param {Object} message, 消息体
     */
    var notify = function(type, message){
        if(!listenerList[type]){
            return false;
        }
        for(var i in listenerList[type]){
            listenerList[type][i](type, message);
        }
        return listenerList[type].length !== 0;
    }
    
    this.addListener = addListener;
    this.on = addListener;
    this.removeListener = removeListener;
    this.off = removeListener;
    this.notify = notify;
});
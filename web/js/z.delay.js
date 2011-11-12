;Z.$package('Z', function(z){
    
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
     * @example
     * 1. delay('id01', 1000, func)
     * 2. delay(1000, func)
     * 3. delay(func) === delay(0, func)
     */
    var delay = function(id, time, func){
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
                func.apply(window);
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
    
    var clearDelay = function(id){
        if(id in timerList){
            window.clearTimeout(timerList[id]);
            timerList[id] = 0;
            delete timerList[id];
            return DELAY_STATUS.NORMAL;
        }
        return DELAY_STATUS.ID_NOT_EXIST;
    }
});
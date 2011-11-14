Z.$package('tally.net', {
    request: 'tally.net.jquery'
}, function(z, dependences){
    var packageContext = this;
    
    var REQUIRE_URLS = {
        GET_BILL: 'service/get_bill.php',
        ADD_BILL: 'service/add_bill.php',
        DELETE_BILL: 'service/delete_bill.php',
        UPDATE_BILL: 'service/update_bill.php',
        
        GET_BILL_LIST: 'service/get_bill_list.php',
        
        GET_CATEGORY: 'service/get_category.php',
        ADD_CATEGORY: 'service/add_category.php',
        
        GET_CATEGORY_LIST: 'service/get_category_list.php',
        
        GET_TAGS: 'service/get_tags.php'
    };

    /**
     * @param {String} url
     * @param {Object} option
     *   option.method || 'GET';
     *   option.context || window;
     *   option.success;
     *   option.argument || {};
     *   option.cacheTime;
     *   option.data
     */
    var require = function(url, option){
        var caller;
        for(var i in packageContext){
            if(packageContext[i] === require.caller){
                caller = i;
                break;
            }
        }
        if(caller){
            option.argument = option.argument || {};
            option.argument.caller = caller;
            option.success = requireSuccess;
        }
        dependences.request.require(url, option);
    };
    
    var requireSuccess = function(data){
        var caller = data.argument.caller;
        delete data.argument.caller;
        caller = caller.charAt(0).toUpperCase() + caller.substr(1);
        if(data.success){
            z.message.notify(caller + 'Success', data);
        }else{
            z.message.notify(caller + 'Failure', data);
        }
    }
    
    
    this.getBill = function(option){
        require(REQUIRE_URLS.GET_BILL_LIST, option);
    };
    
    this.getBillList = function(option){
        require(REQUIRE_URLS.GET_BILL_LIST, option);
    };
    
    this.getCategory = function(optoin){
        require(REQUIRE_URLS.GET_CATEGORY, option);
    };
    
    this.getCategoryList = function(optoin){
        require(REQUIRE_URLS.GET_CATEGORY_LIST, option);
    };
    
    this.addBill = function(option){
        require(REQUIRE_URLS.ADD_BILL, option);
    };

    this.deleteBill = function(option){
        require(REQUIRE_URLS.DELETE_BILL, option);
    };

    this.updateBill = function(option){
        require(REQUIRE_URLS.UPDATE_BILL, option);
    };
    
    this.addCategory = function(option){
        require(REQUIRE_URLS.ADD_CATEGORY, option);
    }
    
});
/**
 * 网络层的jquery实现
 */
Z.$package('tally.net.jquery', function(z){
    
    var requestCache = {};
    
    var getRequireUrl = function(url, data){
        var queryString = z.util.toQueryString(data);
        return url + "?" + queryString;
    };
    
    var getCacheData = function(url, cacheTime){
        var cache = requestCache[url];
        if(!cache){
            return null;
        }
        var time = (+new Date) - cache.responseTime;
        //make sure the cache is valid at last cache time and this cache time
        if(time > cache.cacheTime || time > cacheTime){
            return null;
        }else{
            return cache.data;
        }
    };
    
    var cacheResponse = function(url, data, cacheTime){
        var cache = {
            url: url,
            data: data,
            cacheTime: cacheTime,
            responseTime: (+new Date)
        };
        requestCache[url] = cache;
    };
    
    this.require = function(url, option){
        var method = option.method || 'GET';
        var context = option.context || window;
        var success = option.success;
        var argument = option.argument || {};
        var cacheTime = option.cacheTime;
        var wrapCallback;
        if(method === 'GET' && cacheTime){//check cache
            var requireUrl = getRequireUrl(url, option.data);
            var cacheData = getCacheData(requireUrl, cacheTime);
            if(cacheData){//use the cache
                success.call(context, cacheData);
                return;
            }else{//wrap the get request for cache
                wrapCallback = function(data){
                    data = z.json.parse(data);
                    if(data.success){
                        cacheResponse(requireUrl, data, cacheTime);
                    }
                    data.argument = argument;
                    success.call(context, data);
                }
                option.success = wrapCallback;
            }
        }else{
            wrapCallback = function(data){
                data = z.json.parse(data);
                data.argument = argument;
                success.call(context, data);
            }
            option.success = wrapCallback;
        }
        //use jquery to send ajax request
        $.ajax({
            url: url,
            type: method,
            data: option.data,
            success: option.success
        });
    };
});

Z.$package('Z.util', function(z){
    var browser = new function(){
        this.set = function(name, version){
            this.name = name;
            this.version = version;
            this[name] = version;
        };
        var s, ua = navigator.userAgent.toLowerCase();
        (s = ua.match(/msie ([\d.]+)/)) ? this.set("ie",(s[1])):
        (s = ua.match(/firefox\/([\d.]+)/)) ? this.set("firefox",(s[1])) :
        (s = ua.match(/chrome\/([\d.]+)/)) ? this.set("chrome",(s[1])) :
        (s = ua.match(/opera.([\d.]+)/)) ? this.set("opera",(s[1])) :
        (s = ua.match(/version\/([\d.]+).*safari/)) ? this.set("safari",(s[1])) : 0;
    };
    
    var privatePrefixs = {
        ie: 'Ms',
        firefox: 'Moz',
        opera: 'O',
        chrome: 'Webkit',
        safari: 'Webkit'
    };
    var getPrivatePrefix = function(){
        return privatePrefixs[browser.name];
    };

    var cssSupport = function(property, checkPrivate, value){
        var element = document.createElement('div');
        if(property in element.style){
            element.style[property] = value;
            return element.style[property] === value;
        }else if(checkPrivate){
            var firstChar = property.charAt(0).toUpperCase();
            property = getPrivatePrefix() + firstChar + property.substr(1);
            return cssSupport(property, false, value);
        }else{
            return false;
        }
    }
    
    var ellipsis = function(element){
        var limitWidth = element.clientWidth;
        var ellipsisText = '…';
        var temp = element.cloneNode(true);
        temp.id = 'checkTextLengthNode';
        temp.className = 'check-text-length-node';
        element.parentNode.appendChild(temp);
        var realWidth = temp.clientWidth;
        if(realWidth <= limitWidth){
            return;
        }
        temp.innerHTML = ellipsisText;
        var elliWidth = temp.clientWidth;

        var str = element.innerHTML;
        str = str.replace(/\s+/g, ' ');
        var s, totalWidth = 0;
        for(var i = 0, len = str.length; i < len; i++){
            s = str.charAt(i);
            temp.innerHTML = (s === ' ' ? '&nbsp;' : s);
            totalWidth += temp.clientWidth ;
            if(totalWidth + elliWidth > limitWidth){
                str = str.substr(0, i);
                break;
            }
        }
        element.innerHTML = str + ellipsisText;
        temp.parentNode.removeChild(temp);
    }
    
    /**
     * 
     * @param {Object} obj 要转换成查询字符串的对象
     * @return {String} 返回转换后的查询字符串
     */
    toQueryPair = function(key, value) {
        return encodeURIComponent(String(key)) + "=" + encodeURIComponent(String(value));
    };
    
    /**
     * 
     * @param {Object} obj 要转换成查询字符串的对象
     * @return {String} 返回转换后的查询字符串
     */
    toQueryString = function(obj){
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
    template = function(str, data){
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = !/\W/.test(str) ?
          templateCache[str] = templateCache[str] ||
            template(document.getElementById(str).innerHTML) :
          
          // Generate a reusable function that will serve as a template
          // generator (and which will be cached).
          new Function("obj",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +
            
            // Introduce the data as local variables using with(){}
            "with(obj){p.push('" +
            
            // Convert the template into pure JavaScript
            str
              .replace(/[\r\t\n]/g, " ")
              .split("<%").join("\t")
              .replace(/((^|%>)[^\t]*)'/g, "$1\r")
              .replace(/\t=(.*?)%>/g, "',$1,'")
              .split("\t").join("');")
              .split("%>").join("p.push('")
              .split("\r").join("\\'")
          + "');}return p.join('');");
        
        // Provide some basic currying to the user
        return data ? fn( data ) : fn;
    };
    
    this.browser = browser;
    this.cssSupport = cssSupport;
    this.ellipsis = ellipsis;
    this.toQueryPair = toQueryPair;
    this.toQueryString = toQueryString;
    this.template = template;
});

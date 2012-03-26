
;Z.$package('tally.account', function(z){

    var packageContext = this;

    var isLogin = false;

    this.isLogin = function(){
        return isLogin;
    }

    this.isOffline = function(){
        return !navigator.onLine;
    }

    this.login = function(callback){
        var account = z.storage.get('account');
        if(this.isLogin()){
            callback(true);
        }else if(this.isOffline()){
            //离线时判断时候上一次有保存账户信息下来
            if(account){
                //有就弹出账户输入框验证下
                tally.view.prompt('enter username: ', function(result){
                    if(account.name === result && account.token){
                        //当作成功了
                        isLogin = true;
                        callback(true);
                    }else{
                        tally.view.confirm('login fail, retry? ', function(result){
                            if(result){
                                packageContext.login(callback);
                            }else{  
                                callback(false);
                            }
                        });
                    }
                });
            }else{
                callback(false);
            }
        }else{
            //又没离线, 就验证登录吧
            var username = z.cookie.get('username');
            var token = z.cookie.get('token');
            if(!!username && !!token){
                //如果 cookie 中还有 username 和 token,说明上次登录还有效
                isLogin = true;
                callback(true);
            }else if(account && account.token){
                //如果accouont中有token, 说明上一次登录中, 选择了本地记住登陆态
                tally.net.login({
                    data: {
                        username: account.name,
                        token: account.token
                    },
                    success: function(response){
                        if(response.success){
                            account.token = response.result.token;
                            isLogin = true;
                            callback(true);
                        }else{
                            tally.view.confirm('login fail, retry? ', function(result){
                                if(result){
                                    packageContext.login(callback);
                                }else{  
                                    callback(false);
                                }
                            });
                        }
                    }
                });
            }else{
                //也没记住密码, 弹出登录框吧
                alert('TODO');//TODO
            }
        }

    }
    
});

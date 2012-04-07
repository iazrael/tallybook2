
;Z.$package('tally.account', function(z){

    var packageContext = this;

    var loginCallback;

    var loginUser;

    this.init = function(){
        loginUser = {
            isLogin: false
        };

        z.message.on('loginSuccess', function(response){
            tally.view.hideLoading();
            var result = response.result;
            var account = {
                token: result.token,
                username: result.username,
                autoLogin: result.autoLogin,
                tagsLastModified: result.tagsLastModified,
                catesLastModified: result.catesLastModified
            };
            
            account.isLogin = true;
            packageContext.setUser(account);
            
            tally.view.loginForm.hide();
            loginCallback && loginCallback(true);
            loginCallback = null;
                            
        });
        z.message.on('loginFailure', function(response){
            tally.view.hideLoading();
            if(response.errorCode === tally.config.ERROR_CODE.USER_AUTO_LOGIN_FAILURE){
                tally.view.alert('auto login failure');
                tally.view.loginForm.show();
            }else{
                tally.view.confirm('login fail, retry? ', function(result){
                    if(result){
                        packageContext.login(loginCallback);
                    }else{  
                        loginCallback && loginCallback(false);
                        loginCallback = null;
                    }
                });
            }
        });
    }

    this.setUser = function(account){
        for(var i in account){
            loginUser[i] = account[i];
        }
        z.cookie.set('account', {
            username: loginUser.username,
            token: loginUser.token
        });
        if(loginUser.autoLogin){
            z.storage.local.set('account', loginUser);
        }
    }

    this.getUser = function(){
        return loginUser;
    }

    this.isLogin = function(){
        return loginUser.isLogin;
    }

    this.isOffline = function(){
        return !navigator.onLine;
    }

    this.login = function(callback){
        var account = z.storage.local.get('account');
        if(this.isLogin()){
            callback(true);
        }else if(this.isOffline()){
            //离线时判断时候上一次有保存账户信息下来
            if(account){
                //有就弹出账户输入框验证下
                tally.view.prompt('enter username: ', function(result){
                    if(account.username === result && account.token){
                        //当作成功了
                        packageContext.setUser({
                            isLogin: true,
                            username: account.username,
                            token: account.token
                        });
                        callback(true);
                    }else{
                        tally.view.confirm('login fail, retry? ', function(result){
                            if(result){
                                packageContext.login(callback);
                            }else{  
                                callback(false, tally.config.ERROR_CODE.OFFLINE_LOGIN_ERROR);
                            }
                        });
                    }
                });
            }else{
                callback(false);
            }
        }else{
            //又没离线, 就验证登录吧
            var lastAccount = z.cookie.get('account');
            if(lastAccount && lastAccount.username && lastAccount.token
                && account && account.username === lastAccount.username && account.token === lastAccount.token
                ){
                //如果 seesion 中还有 username 和 token,说明上次登录还有效
                account.isLogin = true;
                packageContext.setUser(account);
                callback(true);
            }else if(account && account.autoLogin && account.token){
                //seesion 中没有token, 且上一次登录中, 选择了自动登录
                loginCallback = callback;
                var data = {
                    username: account.username,
                    autoLogin: account.autoLogin,
                    token: account.token
                };
                tally.net.login({ data: data });
            }else{
                //也没记住密码, 弹出登录框吧
                loginCallback = callback;
                tally.view.loginForm.show();
            }
        }

    }
    
});

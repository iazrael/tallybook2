
;Z.$package('tally.view', function(z){
    
    var $globalMasker;
    var $globalLoading;

    this.init = function(){

        $globalMasker = $('#globalMasker');
        $globalLoading = $('#globalLoading');

        var self = this;
        tally.view.toolbar.init();
        tally.view.billList.init();
        tally.view.billForm.init();
        tally.view.loginForm.init();
        //listen system ready
        z.message.on('systemReady', function(){
            tally.view.hideMasker();    
        });
        tally.view.hideLoading();
    }

    this.registerCommend = function(commends){
        z.dom.bindCommends(document.body, commends);
    }

    this.alert = function(msg){
        if(!z.isString(msg)){
            msg = JSON.stringify(msg);
        }
        alert(msg);
    }

    this.confirm = function(msg, callback){
        var result = false;
        if(confirm(msg)){
            result = true;
        }
        callback(result);
    }

    this.prompt = function(msg, callback){
        var result = prompt(msg);
        callback(result);
    }

    this.showMasker = function(){
        $globalMasker.show();
    }

    this.hideMasker = function(){
        $globalMasker.hide();
    }

    this.showLoading = function(){
        $globalLoading.show();
    }

    this.hideLoading = function(){
        $globalLoading.hide();
    }

    this.jumpToDate = function(dateStr){
        this.toolbar.setDate(dateStr);
    }
});

;Z.$package('tally.view.toolbar', function(z){
    
    var $dateInput;
    var $billListToolbar;

    this.setDate = function(dateStr){
        $dateInput.val(dateStr);
        z.message.notify(tally.view, 'dateChange', dateStr);
    }

    this.init = function(){
        $billListToolbar = $('#billListToolbar');

        $dateInput = $('#dateInput');

        $dateInput.change(function(e){
            var dateStr = $dateInput.val();
            if(!checkeDate(dateStr)){
                return;
            }
            z.message.notify(tally.view, 'dateChange', dateStr);
        });

        tally.view.registerCommend({
            createBill: function(param, element, event){
                //验证时间是否有效什么的
                var dateStr = $dateInput.val();
                if(!checkeDate(dateStr)){
                    return;
                }
                var data = {
                    occurredTime: dateStr
                };
                tally.view.billForm.newBill(data);
            }
        });
    }

    var checkeDate = function(dateStr){
        if(dateStr === ''){
            tally.view.alert('请输入日期!');
            return false;
        }else if(!tally.util.verifyDate(dateStr)){
            tally.view.alert('日期格式不正确!');
            return false;
        }
        return true;
    }

});

;Z.$package('tally.view.billList', function(z){
    
    
    var $container,
        $billListContainer,
        $billList;

    var scrollAction;
    
    var removeBill = function(billId){
        $('#bill-item-' + billId).remove();
    }

    this.init = function(){
        $container = $('#container');
        $billListContainer = $('#billListContainer');
        $billList = $('#billList');

        scrollAction = new z.ui.ScrollAction({
            element: $container.get(0),
            onScrollToBottom: function(){
                z.message.notify(tally.view, 'loadBills');
            }
        });
    }
    
    this.add = function(bills, index){
        z.dom.render($billList.get(0), 'billItemTmpl', {list: bills}, index);
    }

    this.remove = function(bills){
        for (var i = 0; i < bills.length; i++) {
            removeBill(bills[i].id);
        };
    }

    this.update = function(bills){
        //TODO
    }

    this.removeAll = function(){
        $billList.empty();
    }

    
});

;Z.$package('tally.view.billForm', function(z){
    var packageContext = this;

    var $billFormContainer,
        $billForm,
        $billFormDate,
        $billFormCateIn,
        $billFormCateOut,
        $billFormRemark,
        $billFormCateType,
        $billFormTag,
        $billFormAmount
        ;

    var cateListHasBuild = false;
    var isLock = false;

    this.init = function(){
        $billFormContainer = $('#billFormContainer');
        z.dom.render($billFormContainer.get(0), 'billFormTmpl');
        
        $billForm = $('#billForm');
        $billFormDate = $('#billFormDate');
        $billFormCateIn = $('#billFormCateIn');
        $billFormCateOut = $('#billFormCateOut');
        $billFormRemark = $('#billFormRemark');
        $billFormCateType = $('#billFormCateType');
        $billFormAmount = $('#billFormAmount');
        $billFormTag = $('#billFormTag');

        tally.view.registerCommend({
            cancelBillForm: function(param, element, event){
                packageContext.hide();
            }
        });

        $billForm.submit(function(e){
            e.preventDefault();
            if(packageContext.isLock()){
                return;
            }
            // packageContext.lock(true);
            var data = getFormData();
            tally.controller.addBill(data);
        });
        //
        $billFormContainer.show();
    }

    this.isLock = function(){
        return isLock;
    }

    this.lock = function(status){
        isLock = status;
    }

    this.show = function(){
        if(!cateListHasBuild){
            cateListHasBuild = true;
            var cateList = tally.controller.getCategoryList();

            z.dom.render($billFormCateIn.get(0), 'cateListTmpl', { list: cateList.getInCates() });
            z.dom.render($billFormCateOut.get(0), 'cateListTmpl', { list: cateList.getOutCates() });
        }
        
        $billFormContainer.addClass('show');
    }

    this.hide = function(){
        $billFormContainer.removeClass('show');
    }

    this.reset = function(){
        this.lock(false);
        $billFormRemark.val('');
        $billFormAmount.val('');
        $billFormTag.val('');
    }

    this.newBill = function(data){
        this.reset();
        if(data && data.occurredTime){
            $billFormDate.val(data.occurredTime);
        }
        this.show();
        z.util.delay('billFormAutoFocus', 500, function(){ $billFormAmount.focus(); });
    }

    //=========
    // 内部方法
    //=========
    var getFormData = function(){
        var data = {
            occurredTime: $billFormDate.val(),
            amount: $billFormAmount.val(),
            tags: $billFormTag.val(),
            remark: $billFormRemark.val()
        };
        if($billFormCateType.prop('checked')){
            //收入
            data.type = 1;
            data.categoryId = $billFormCateIn.val();
        }else{
            //支出
            data.type = 0;
            data.categoryId = $billFormCateOut.val();
        }
        return data;
    }
    
});

;Z.$package('tally.view.loginForm', function(z){

    var $loginFormContainer,
        $loginForm,
        $username,
        $password,
        $autoLoginNext
        ;

    this.init = function(){
        $loginFormContainer = $('#loginFormContainer');
        z.dom.render($loginFormContainer.get(0), 'loginFormTmpl');

        $loginForm = $('#loginForm');
        $username = $('#username');
        $password = $('#password');
        $autoLoginNext = $('#autoLoginNext');

        $loginForm.submit(function(e){
            e.preventDefault();
            var data = getFormData();
            tally.controller.login({ data: data });
        });

    }

    this.show = function(){
        var account = z.storage.local.get('account');
        if(account && account.autoLogin){
            $autoLoginNext.prop('checked', 1);
        }
        $loginFormContainer.addClass('show');
        $username.focus();
    }

    this.hide = function(){
        $loginFormContainer.removeClass('show');
    }


    var getFormData = function(){
        var data = {
            username: $username.val(),
            password: $password.val(),
            autoLoginNext: $autoLoginNext.prop('checked') ? 1 : 0
        };
        return data;
    }

});




;Z.$package('tally.view', [
    'tally.view.billList'
],
function(z){
    
    var $globalMasker;
    var $globalLoading;

    this.init = function(){

        $globalMasker = $('#globalMasker');
        $globalLoading = $('#globalLoading');

        var self = this;
        //listen system ready
        z.message.on('systemReady', function(){
            self.toolbar.init();
            self.billList.init();
            self.billForm.init();

            tally.view.hideLoading();
            tally.view.hideMasker();    
            z.message.notify('viewReady');

        });
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

        z.dom.bindCommends($billListToolbar.get(0), {
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
        $billFormDate,
        $billFormCateIn,
        $billFormCateOut,
        $billFormRemark,
        $billFormCateType,
        $billFormAmount
        ;

    this.init = function(){
        $billFormContainer = $('#billFormContainer');
        z.dom.render($billFormContainer.get(0), 'billFormTmpl', {});
        
        $billFormDate = $('#billFormDate');
        $billFormCateIn = $('#billFormCateIn');
        $billFormCateOut = $('#billFormCateOut');
        $billFormRemark = $('#billFormRemark');
        $billFormCateType = $('#billFormCateType');
        $billFormAmount = $('#billFormAmount');

        var cateList = tally.controller.getCategoryList();

        z.dom.render($billFormCateIn.get(0), 'cateListTmpl', { list: cateList.getInCates() });
        z.dom.render($billFormCateOut.get(0), 'cateListTmpl', { list: cateList.getOutCates() });

        z.dom.bindCommends($billFormContainer.get(0), {
            cancelBillForm: function(param, element, event){
                packageContext.hide();
            }
        });

        $billFormContainer.submit(function(e){
            e.preventDefault();
            var data = getFormData();
            tally.controller.addBill(data);
        });

        $billFormContainer.show();
    }

    this.show = function(){
        $billFormContainer.addClass('show');
    }

    this.hide = function(){
        $billFormContainer.removeClass('show');
    }

    this.newBill = function(data){
        $billFormDate.val(data.occurredTime);
        this.show();
    }

    //=========
    // 内部方法
    //=========
    var getFormData = function(){
        var data = {
            occurredTime: $billFormDate.val(),
            amount: $billFormAmount.val(),
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


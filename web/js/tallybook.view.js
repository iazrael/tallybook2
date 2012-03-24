
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

            tally.controller.loadBillList('2012-03-18');

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
});

;Z.$package('tally.view.toolbar', function(z){
    
    var $dateInput;
    var $billListToolbar;

    this.init = function(){
        $dateInput = $('#dateInput');
        $dateInput.val(tally.util.getDate());

        $billListToolbar = $('#billListToolbar');

        $billListToolbar.change(function(e){
            tally.controller.setCurrentDate($billListToolbar.val());
        });

        z.dom.bindCommends($billListToolbar.get(0), {
            createBill: function(param, element, event){
                //验证时间是否有效什么的
                var dateStr = $dateInput.val();
                if(dateStr === ''){
                    tally.view.alert('请输入日期!');
                    return;
                }else if(!tally.util.verifyDate(dateStr)){
                    tally.view.alert('日期格式不正确!');
                    return;
                }
                var data = {
                    occurredTime: dateStr
                };
                tally.view.billForm.newBill(data);
            }
        });
    }
});

;Z.$package('tally.view.billList', function(z){
    
    
    var $billListContainer,
        $billList;
    
    var removeBill = function(billId){
        $('#bill-item-' + billId).remove();
    }

    this.init = function(){
        $billListContainer = $('#billListContainer');
        $billList = $('#billList');
    }
    
    this.add = function(bills){
        z.dom.render($billList.get(0), 'billItemTmpl', {list: bills}, true);
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


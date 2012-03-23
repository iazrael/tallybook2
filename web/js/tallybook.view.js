Z.$package('tally.view', [
    'tally.view.billList'
],
function(z){
    
    this.init = function(){
        this.toolbar.init();
        this.billList.init();
        this.billForm.init();
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
});

Z.$package('tally.view.toolbar', function(z){
    
    var $dateInput;
    var $billListToolbar;

    this.init = function(){
        $dateInput = $('#dateInput');
        $dateInput.val(tally.util.getDate());

        $billListToolbar = $('#billListToolbar');
        z.dom.bindCommends($billListToolbar.get(0), {
            createBill: function(param, element, event){
                //验证时间是否有效什么的
                var dateStr = $dateInput.val();
                if(!tally.util.verifyDate(dateStr)){
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

Z.$package('tally.view.billList', function(z){
    
    
    var $billListContainer,
        $billList;
    
    var removeBill = function(billId){
        $billList.remove('#bill-item-' + billId);
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

Z.$package('tally.view.billForm', function(z){
    var packageContext = this;

    var $billFormContainer;

    this.init = function(){
        $billFormContainer = $('#billFormContainer');
        // z.dom.render($billFormContainer.get(0), 'billFormTmpl', {});
        
        z.dom.bindCommends($billFormContainer.get(0), {
            cancelBillForm: function(param, element, event){
                packageContext.hide();
            },
            sureBillForm: function(param, element, event){
                // packageContext.hide();
            }
        });
    }

    this.show = function(){
        $billFormContainer.addClass('show');
    }

    this.hide = function(){
        $billFormContainer.removeClass('show');
    }

    this.newBill = function(data){
        this.show();
    }
});


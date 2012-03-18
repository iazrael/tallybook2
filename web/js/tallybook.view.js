Z.$package('tally.view', [
    'tally.view.billList'
],
function(z){
    
    this.init = function(){
        this.toolbar.init();
        this.billList.init();
        this.billForm.init();
    }
});

Z.$package('tally.view.toolbar', function(z){
    
    var $dateInput;
    var $billListToolbar;

    this.init = function(){
        $dateInput = $('#dateInput');
        $dateInput.val('2012-05-05');

        $billListToolbar = $('#billListToolbar');
        z.dom.bindCommends($billListToolbar.get(0), {
            createBill: function(param, element, event){

            }
        });
    }
});

Z.$package('tally.view.billList', function(z){
    
    
    var $billListContainer,
        $billList;
    
    var removeBill = function(billId){
        $billList.remove('#billItem' + billId);
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

    }

    this.removeAll = function(){
        $billList.empty();
    }

    
});

Z.$package('tally.view.billForm', function(z){


    this.init = function(){
        
    }
});


Z.$package('tally.view', [
    'tally.view.billList'
],
function(z){
    
    this.init = function(){
        this.toolbar.init();
        this.billList.init();
    }
});

Z.$package('tally.view.toolbar', function(z){
    
    var $dateInput;

    this.init = function(){
        $dateInput = $('#dateInput');
        $dateInput.val('2012-05-05');
    }
});

Z.$package('tally.view.billList', function(z){
    
    
    var $billListContainer,
        $billList;
    
    var removeBill = function(billId){

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
            bill[i]
        };
    }

    this.removeAll = function(){
        
    }

    
});


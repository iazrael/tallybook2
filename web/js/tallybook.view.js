Z.$package('tally.view', [
    'tally.view.billList'
],
function(z){
    
    this.init = function(){
        tally.view.billList.init();
    }
});

Z.$package('tally.view.billList', function(z){
    
    
    var $billListContainer,
        $billList;
    
    this.init = function(){
        $billListContainer = $('#billListContainer');
        $billList = $('#billList');
    }
    
    this.add = function(bills){
        z.dom.render($billList.get(0), 'billItemTmpl', {list: bills}, true);
    }

    this.remove = function(bills){

    }

    this.removeAll = function(){
        
    }

    
});


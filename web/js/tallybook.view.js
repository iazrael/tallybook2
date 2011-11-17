jQuery(function($){
Z.$package('tally.view', [
    'tally.view.billList'
],
function(z){
    
    this.getTemplate = function(id){
        var $script = $('#' + id);
        var tmpl = $script.html();
        $script.remove();
        return tmpl;
    }
    
    this.init = function(){
        tally.view.billList.init();
    }
});

Z.$package('tally.view.billList', function(z){
    
    var TEMPLATES = {
        BILL_LIST: ''
    };
    
    var $billListCon;
    var billListTmpl;
    
    this.init = function(){
        $billListCon = $('#billListContainer');
        billListTmpl = tally.view.getTemplate('billListTemplate');
    }
    
    this.render = function(billList){
        
        var html = z.string.template(billListTmpl, billList);
        $billListCon.html(html);
    }
    
});
});
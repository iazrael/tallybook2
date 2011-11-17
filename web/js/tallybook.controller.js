

Z.$package('tally.controller', [
    'tally.model',
    'tally.net',
    'tally.view'
], function(z){
    
    var BILL_LIST_CONFIG = alloy.config.BILL_LIST_CONFIG;
    
    var loadBillList = function(date, page, pageCount){
        pageCount = pageCount || BILL_LIST_CONFIG.BILL_ITEMS_PER_PAGE;
        if(page < 0){
            page = 0;
        }
        var start = page * pageCount;
        var data = {
            date: date,
            start: start,
            count: pageCount
        };
        
        tally.net.getBillList({
            data: data
        });
    }
    
    this.init = function(){
        z.message.on('GetBillListSuccess', function(data){
            var billList = tally.model.BillList.parse(data.result.list);
            tally.view.BillList.render(billList);
        });
        
        
        loadBillList('', 0);
    }
    
    
});



Z.$package('tally.controller', [
    'tally.model',
    'tally.net',
    'tally.view'
], function(z){
    
    var CONFIG = {
        BILL_ITEMS_PER_PAGE: 10
    
    };
    
    
    
    var loadBillList = function(date, page, pageCount){
        pageCount = pageCount || CONFIG.BILL_ITEMS_PER_PAGE;
        if(page < 0){
            page = 0;
        }
        var start = page * CONFIG.BILL_ITEMS_PER_PAGE;
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

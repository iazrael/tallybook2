

Z.$package('tally.controller', [
    'tally.model',
    'tally.net',
    'tally.view'
], function(z){
    
    var billListConfig = tally.config.BILL_LIST_CONFIG;

    var billList;
    
    var loadBillList = function(date, page, pageCount){
        pageCount = pageCount || billListConfig.BILL_ITEMS_PER_PAGE;
        if(!page || page < 0){
            page = 1;
        }
        var start = (page - 1) * pageCount;
        var data = {
            date: date,
            start: start,
            count: pageCount
        };
        
        tally.net.getBillList({
            data: data
        });
    }

    var parseBill = function(data) {
        var bill = new tally.model.Bill({ notifyContext: billList });
        bill.id = data.id;
        bill.type = data.type;
        bill.cate = data.cate;
        bill.amount = data.amount;
        bill.tags = data.tags;
        bill.remark = data.remark;
        bill.occurredTime = data.occurredTime;
        bill.createTime = data.createTime;
        bill.updateTime = data.updateTime;
        return bill;
    }

    var parseBills = function(data) {
        var list = [];
        for(var i in data){
            list.push(parseBill(data[i]));
        }
        return list;
    }
    
    this.init = function(){
        billList = new tally.model.BillList();
        //listen model event to change view
        z.message.on(billList, 'add', function(data){
            tally.view.billList.add([data.item]);
        });
        z.message.on(billList, 'addRange', function(data){
            tally.view.billList.add(data.items);
        });
        z.message.on(billList, 'remove', function(data){
            tally.view.billList.remove([data.item]);
        });
        z.message.on(billList, 'removeRange', function(data){
            tally.view.billList.remove(data.items);
        });
        z.message.on(billList, 'clear', function(data){
            tally.view.billList.removeAll();
        });

        //listen model event to change model
        z.message.on('getBillListSuccess', function(data){
            var list = parseBills(data.result.list);
            billList.addRange(list);
        });
        z.message.on('getBillListFailure', function(data){
            alert('getBillListFailure');//TODO
        });

        //listen system ready
        z.message.on('systemReady', function(){
            loadBillList();
        });
        
        //statr logic
        var depQueue = new z.class.DependentQueue();
        
    }
    
    
});

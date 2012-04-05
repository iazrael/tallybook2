

;Z.$package('tally.controller', [
    'tally.model',
    'tally.net',
    'tally.view'
], function(z){
    
    var packageContext = this;

    var billList;
    var tagList;
    var cateList;
    var currentDate;
    var currentPage = 1;
    
    //**************************************************
    // 对外接口
    //**************************************************

    this.getTagList = function(){
        return tagList;
    }

    this.getBillList = function(){
        return billList;
    }

    this.getCategoryList = function(){
        return cateList;
    }


    /**
     * 清空 billList 跳转到指定日期的账单
     * @param  {String} dateStr 
     * 
     */
    this.jumpToDate = function(dateStr){
        currentDate = dateStr;
        currentPage = 1;
        billList.clear();
        tally.view.showLoading();
        loadBillList(dateStr);
    }

    this.addBill = function(data){
        tally.view.showLoading();
        tally.net.addBill({
            data: data
        });

    }

    this.handleError = function(errorCode){
        //TODO
    }

    this.login = function(param){
        tally.view.showLoading();
        tally.net.login(param);
    }

    this.init = function(){
        billList = new tally.model.BillList();
        tagList = new tally.model.TagList();
        cateList = new tally.model.CategoryList();

        initEvents();
        
        run();

    }

    //////////////////////////////////

    var initEvents = function(){

        z.message.on('systemReady', function(){
            tally.view.toolbar.setDate(tally.util.getDate());
            // tally.view.jumpToDate('2012-03-18');
        });

        z.message.on(tally.view, 'dateChange', function(dateStr){
            packageContext.jumpToDate(dateStr);
        });

        z.message.on(tally.view, 'loadBills', function(){
            tally.view.showLoading();
            currentPage++;
            loadBillList(currentDate, currentPage);
        });

        //listen model event to change view
        z.message.on(billList, 'add', function(data){
            tally.view.billList.add(data.items, data.index);
        });
        z.message.on(billList, 'remove', function(data){
            tally.view.billList.remove(data.items);
        });
        z.message.on(billList, 'clear', function(data){
            tally.view.billList.removeAll();
        });

        //listen net event to change model
        z.message.on('getBillListSuccess', function(response){
            var list = parseBills(response.result.list);
            billList.addRange(list);
            tally.view.hideLoading();
        });
        z.message.on('getBillListFailure', function(response){
            tally.view.hideLoading();
            tally.view.alert('getBillListFailure ' + response.errorCode);//TODO
        });
        z.message.on('getCategoryListSuccess', function(response){
            var result = response.result;
            var list = parseCategorys(result.list);
            cateList.clear();
            cateList.addRange(list);
        });
        z.message.on('getCategoryListFailure', function(response){
            tally.view.alert('getCategoryListFailure ' + response.errorCode);//TODO
        });
        z.message.on('getTagListSuccess', function(response){
            var result = response.result;
            var list = parseTags(result.list);
            tagList.clear();
            tagList.addRange(list);

        });
        z.message.on('getTagListFailure', function(response){
            tally.view.alert('getTagListFailure ' + response.errorCode);//TODO
        });
        z.message.on('addBillSuccess', function(response){
            tally.view.hideLoading();
            tally.view.billForm.hide();
            var bill = parseBill(response.result.data);
            if(bill.occurredTime === currentDate){
                billList.add(bill, 0);
            }else{
                tally.view.confirm('是否转到 ' + bill.occurredTime + ' 的账单记录?', function(result){
                    if(result){
                        tally.view.jumpToDate(bill.occurredTime);
                    }
                });
            }
            
        });
        z.message.on('addBillFailure', function(response){
            tally.view.hideLoading();
            tally.view.alert('addBillFailure ' + response.errorCode);//TODO
        });
    }

    // system run
    var run = function(){
        //statr logic
        var depQueue = new z.util.DependentQueue({
            onPause: function(queue, item){
                tally.view.confirm(item.id + ' 失败, 是否忽略?', function(result){
                    if(result){
                        queue.next();
                    }else{
                        queue.stop();
                    }
                });
            },
            onStop: function(queue, item){
                tally.view.alert('加载失败! 请刷新重试!');
            },
            onFinish: function(){
                z.message.notify('systemReady');
            }
        });

        depQueue.add({
            id: 'login',
            exec: function(queue, item){
                tally.account.login(function(result, errorCode){
                    if(result){
                        queue.next();
                    }else{
                        queue.stop();
                    }
                })
            }
        });

        depQueue.add({
            id: 'getTagList',
            exec: function(queue, item){
                loadTagList(function(response){
                    if(response.success){
                        z.message.notify('getTagListSuccess', response);
                        queue.next();
                    }else{
                        z.message.notify('getTagListFailure', response);
                        queue.pause();
                    }
                });
            }
        });
        depQueue.add({
            id: 'getCategoryList',
            exec: function(queue, item){
                loadCategoryList(function(response){
                    if(response.success){
                        z.message.notify('getCategoryListSuccess', response);
                        queue.next();
                    }else{
                        z.message.notify('getCategoryListFailure', response);
                        queue.pause();
                    }
                });
            }
        });
        
        //run it
        depQueue.run();
    }

    //**************************************************
    // net require
    //**************************************************
    var loadBillList = function(date, page, pageCount){
        pageCount = pageCount || tally.config.BILL_ITEMS_PER_PAGE;
        if(!page || page < 0){
            page = 1;
        }
        date = date || tally.util.getDate();
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
    var loadCategoryList = function(callback){
        tally.net.getCategoryList({ success: callback });
    }
    var loadTagList = function(callback){
        tally.net.getTagList({ success: callback });
    }
    //**************************************************
    // date parse
    //**************************************************
    var parseBill = function(data) {
        var bill = new tally.model.Bill({ notifyContext: billList });
        bill.id = data.id;
        bill.type = data.type;
        bill.cate = cateList.get(data.categoryId);
        bill.amount = data.amount;
        var tags = [];
        for(var i in data.tags){
            tags.push(tagList.get(data.tags[i]));
        }
        bill.tags = tags;
        bill.remark = data.remark;
        bill.occurredTime = data.occurredTime;
        return bill;
    }

    var parseBills = function(data) {
        var list = [];
        for(var i in data){
            list.push(parseBill(data[i]));
        }
        return list;
    }

    var parseTags = function(data){
        var list = [], tag;
        for(var i in data){
            tag = new tally.model.Tag({ notifyContext: tagList });
            tag.id = data[i].id;
            tag.name = data[i].name;
            list.push(tag);
        }
        return list;
    }

    var parseCategory = function(data){
        var cate = new tally.model.Category({ notifyContext: cateList });
        cate.id = data.id;
        cate.name = data.name;
        cate.index = data.index;
        cate.type = data.type;
        cate.parentId = data.parentId;
        return cate;
    }

    var parseCategorys = function(data){
        var list = [], cate, child, children;
        for(var i in data){
            cate = parseCategory(data[i]);
            children = data[i].children;
            if(children){
                cate.children = [];
                for(var j in children){
                    child = parseCategory(children[j]);
                    cate.children.push(child);
                    //全部加到list, 用于根据id查找, 需要用到只有parentCate的时候使用filter过滤出来
                    list.push(child);
                }
            }
            list.push(cate);
        }
        return list;
    }
    
});



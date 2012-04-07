

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
    var allBillLoaded = false;
    
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

    this.addBill = function(data){
        tally.view.showLoading();
        var tags = tally.util.translateTags(data.tags);
        delete data.tags;
        if(tags){//有tag, 先添加tag, addBill的操作在添加成功后的回调执行
            tally.net.addTags({
                data: {tags: tags},
                argument: {
                    action: 'addBill',
                    data: data
                }
                });
        }else{
            tally.net.addBill({
                data: data
            });
        }
        
    }

    this.addTags = function(data){
        tally.net.addTags({
            data: data
        });
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
        allBillLoaded = false;
        tally.view.showLoading();
        loadBillList(dateStr);
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
            if(allBillLoaded){
                return;
            }
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
            tally.view.hideLoading();
            var result = response.result;
            if(!result.list.length && billList.length() >= result.total){
                allBillLoaded = true;
            }else{
                var list = parseBills(result.list);
                billList.addRange(list);
            }
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
            var bill = parseBill(response.result.data);
            if(bill.occurredTime === currentDate){
                billList.add(bill, 0);
            }
            tally.view.confirm('继续添加?', function(result){
                if(result){
                    tally.view.billForm.newBill();
                }else{
                    tally.view.billForm.hide();
                    if(bill.occurredTime !== currentDate){
                        tally.view.confirm('是否转到 ' + bill.occurredTime + ' 的账单记录?', function(result){
                            if(result){
                                tally.view.jumpToDate(bill.occurredTime);
                            }
                        });
                    }
                }
            });
            
        });
        z.message.on('addBillFailure', function(response){
            tally.view.hideLoading();
            tally.view.alert('addBillFailure ' + response.errorCode);//TODO
        });
        z.message.on('addTagsSuccess', function(response){
            
            var result = response.result;
            var list = parseTags(result.list);
            tagList.addRange(list);

            tally.account.setUser({
                tagsLastModified: result.lastModified
            });
            if(response.argument.action === 'addBill'){
                z.message.notify(packageContext, 'billTagsAdd', {result: list, argument: response.argument});
            }
            
        });
        z.message.on('addTagsFailure', function(response){
            //添加tag失败, 之后导致添加bill失败
            if(response.argument.action === 'addBill'){
                z.message.notify('addBillFailure', response);
            }else{
                tally.view.alert('addTagsFailure ' + response.errorCode);
            }
            
        });

        z.message.on(packageContext, 'billTagsAdd', function(data){
            var tags = [], list = data.result;
            for(var i in list){
                tags.push(list[i].id);
            }
            var billData = data.argument.data;
            billData.tags = tags.join(',');
            tally.net.addBill({
                data: billData
            });
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
                tally.view.alert('初始化出错, 请刷新重试!');
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
                var user = tally.account.getUser();
                var userData = z.storage.local.get(user.username);
                if(userData && userData.tagList && userData.tagList.result.lastModified === user.tagsLastModified){
                    //缓存的数据还可用
                    z.message.notify('getTagListSuccess', userData.tagList);
                    queue.next();
                }else{
                    loadTagList(function(response){
                        if(response.success){
                            if(!userData){
                                userData = {};
                            }
                            userData.tagList = response;
                            z.storage.local.set(user.username, userData);
                            z.message.notify('getTagListSuccess', response);
                            queue.next();
                        }else{
                            // z.message.notify('getTagListFailure', response);
                            queue.stop();
                        }
                    });
                }
            }
        });
        depQueue.add({
            id: 'getCategoryList',
            exec: function(queue, item){
                var user = tally.account.getUser();
                var userData = z.storage.local.get(user.username);
                if(userData && userData.cateList && userData.cateList.result.lastModified === user.catesLastModified){
                    //缓存的数据还可用
                    z.message.notify('getCategoryListSuccess', userData.cateList);
                    queue.next();
                }else{
                    loadCategoryList(function(response){
                        if(response.success){
                            if(!userData){
                                userData = {};
                            }
                            userData.cateList = response;
                            z.storage.local.set(user.username, userData);
                            z.message.notify('getCategoryListSuccess', response);
                            queue.next();
                        }else{
                            // z.message.notify('getCategoryListFailure', response);
                            queue.stop();
                        }
                    });
                }
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



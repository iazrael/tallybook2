
Z.$package('tally.config', function(z){

    
    /**
     * ajax 服务请求的路径
     */
    var SERVICE_ROOT = '../server/service/';
    this.AJAX_REQUIRE_URLS = {
        GET_BILL: 'get_bill.php',
        ADD_BILL: 'add_bill.php',
        DELETE_BILL: 'delete_bill.php',
        UPDATE_BILL: 'update_bill.php',
        
        GET_BILL_LIST: 'get_bill_list.php',
        
        GET_CATEGORY: 'get_category.php',
        ADD_CATEGORY: 'add_category.php',
        
        GET_CATEGORY_LIST: 'get_category_list.php',
        
        GET_TAGS: 'get_tags.php'
    };
    
    for(var i in this.AJAX_REQUIRE_URLS){
        this.AJAX_REQUIRE_URLS[i] = SERVICE_ROOT + this.AJAX_REQUIRE_URLS[i];
    }
    
    /**
     * 账单列表的配置
     */
    this.BILL_LIST_CONFIG = {
         BILL_ITEMS_PER_PAGE: 10
    };
});


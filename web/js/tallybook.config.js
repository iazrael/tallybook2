
;Z.$package('tally.config', function(z){
    /*
     * 错误码, 1xxx 的是前台错误
     * 10XX: 账号相关错误
     * 2xxx 的是后台返回的错误
     */
    this.ERROR_CODE = {
        NOT_LOGIN: 1001,
        AUTO_LOGIN_ERROR: 1002,
        OFFLINE_LOGIN_ERROR: 1003,

        USER_AUTO_LOGIN_FAILURE: 2102
    
    };

    /**
     * ajax 服务请求的路径
     */
    var SERVICE_ROOT = './service/';
    this.AJAX_REQUIRE_URLS = {
        GET_BILL: 'get_bill.php',
        ADD_BILL: 'add_bill.php',
        DELETE_BILL: 'delete_bill.php',
        UPDATE_BILL: 'update_bill.php',
        
        GET_BILL_LIST: 'get_bill_list.php',
        
        GET_CATEGORY: 'get_category.php',
        ADD_CATEGORY: 'add_category.php',
        
        GET_CATEGORY_LIST: 'get_category_list.php',
        
        GET_TAGS: 'get_tags.php',

        GET_TAG_LIST: 'get_tag_list.php',

        LOGIN: 'login.php'
    };
    
    for(var i in this.AJAX_REQUIRE_URLS){
        this.AJAX_REQUIRE_URLS[i] = SERVICE_ROOT + this.AJAX_REQUIRE_URLS[i];
    }
    
    /**
     * 每页账单条数
     * @type {Number}
     */
    this.BILL_ITEMS_PER_PAGE = 15;

    /**
     * 日期格式
     * @type {String}
     */
    this.DATE_FORMAT = 'yyyy-MM-dd';

    /**
     * 日期格式的正则
     * @type {RegExp}
     */
    this.DATE_FORMAT_REGEXP = /\d{4}-\d{2}-\d{2}/;
});


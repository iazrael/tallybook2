Z.$package('tally.util', function(z){
    var packageContext = this;
    
    /**
     * 返回格式化好的时间
     * @param {Date} date 
     * @return {String} 
     */
    this.getDate = function(date){
        return z.date.format(date || new Date(), tally.config.DATE_FORMAT);
    }

    /**
     * 验证日期格式
     * @param  {String} dateStr	
     * @return {Date}  	
     */
    this.verifyDate = function(dateStr){
    	return tally.config.DATE_FORMAT_REGEXP.test(dateStr);
    }
    
});

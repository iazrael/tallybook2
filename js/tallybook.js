Az.package('tally', function(z){
	
});
Az.package('tally.model', function(z){
	var Bill = function(){
		this.id = 0;
		this.type = 0;
		this.cate = 0;
		this.tags = '';
		this.amount = 0;
		this.remoark = '';
		var now = +new Date;
		this.occurredTime = now;
		this.createTime = now;
		this.updateTime = now;
	};
	
	var BillList = function(){
		this.list = [];
	};
	
	BillList.prototype = {
		add: function(bill){
			
		},
		remove: function(bill){
		
		},
		update: function(bill){
		
		}
	};
});
Az.package('tally.net', {
	request: 'tally.net.jquery'
}, function(z, dependences){
	var require = function(url, option){
		//some code...
		dependences.request.require(url, option);
	};
	
});
Az.package('tally.net.jquery', function(z){
	this.require = function(url, option){
		//not implement
		console.log('use jquery to require: ' + url);
	};
});
Az.package('tally.controller', [
	'tally.model',
	'tally.net',
	'tally.view'
], function(z){
	
});
Az.package('tally.view', function(z){
	
});
Az.package('Az.test', function(z){
});
Az.package('Az.test.test1', {
	t: 'Az.test2',
	u: 'Az.util',
	o: 'Az.tools'
}, function(z, d){
	console.log(d.t);
});
Az.package('Az.test2', function(z){
	console.log(11111111);
});
Az.package('Az.test2', function(z){
	console.log(22222222);
});
Az.package('Az.util', {
	t: 'Az.tools'
}, function(z){
});
Az.package('Az.tools',function(z){
});
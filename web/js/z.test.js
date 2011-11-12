Z.$package('Z.test', function(z){
});
Z.$package('Z.test.test1', {
    t: 'Z.test2',
    u: 'Z.util',
    o: 'Z.tools'
}, function(z, d){
    console.log(d.t);
});
Z.$package('Z.test2', function(z){
    console.log(11111111);
});
Z.$package('Z.test2', function(z){
    console.log(22222222);
});
Z.$package('Z.util', {
    t: 'Z.tools'
}, function(z){
});
Z.$package('Z.tools',function(z){
});
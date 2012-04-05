/**
 * make for nodejs
 */

var fs = require('fs');

var argus = process.argv.slice(2);

var source = argus[0];
var target = argus[1];
var html = argus[2];
var manifest = argus[3];

var file = fs.readFileSync(source + manifest);
file = file.toString().replace('<%=updateTime%>', +new Date);
fs.writeFileSync(target + manifest, file);

file = fs.readFileSync(source + html);
var matchList = {};
file = file.toString().replace(/<script\s+output="([^"]+)"\s+src="([^"]+)".*?<\/script>/ig, function(m, o, s){
	if(matchList[o]){
		return '';
	}else{
		matchList[o] = 1;
		return '<script src="js/ztool.all.js"></script>';
	}
});
fs.writeFileSync(target + html, file);
console.log('done');







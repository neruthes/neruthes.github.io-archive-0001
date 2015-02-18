/*

Lab Sitemap Generator
Run on Node.js
(c) Copyright 2014 All Rights Reserved by Joy Neop

*/

var labPath = __dirname;
var accumulate = '';

var fs = require('fs');

var list = [
	14, // 2013
	4 // 2014
];

for (var i = list.length-1; i >= 0; i--) {
	for (var j = list[i]; j >= 1; j--) {
		accumulate += '\n<url>\n';
		accumulate += '\t<loc>http://joyneop.xyz/lab/' + (2013 + i) + '/' + j + '/</loc>\n';
		accumulate += '\t<priority>0.8</priority>\n';
		accumulate += '</url>\n';
	}
}


fs.writeFileSync(labPath + '/lab_sitemap.xml', accumulate);

console.log('Done!');
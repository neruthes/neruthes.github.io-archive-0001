/*

Blog Sitemap Generator
Run on Node.js
(c) Copyright 2014 All Rights Reserved by Joy Neop

*/

var blogPath = '/Users/JoyNeop/Developer/joyneop.github.io/blog';
var postTemplate = '<url>\n<loc>__LOC__</loc>\n<lastmod>__MOD__</lastmod>\n<priority>0.8</priority>\n</url>\n\n';
var listJson;
var accumulate = '<url>\n<loc>http://www.joyneop.com/blog/archive.html</loc>\n<priority>0.8</priority>\n</url>\n\n';

var fs = require('fs');

listJson = JSON.parse(fs.readFileSync(blogPath + '/list.json', 'utf8'));

var maxId = listJson.list.length-1;
for (var i = maxId; i > 0; i--) {
	accumulate = accumulate + postTemplate.replace(/__LOC__/g, 'http://joyneop.xyz/blog/?p=' + i).replace(/__MOD__/g, listJson.list[i]['Time']);
};


fs.writeFile(blogPath + '/blog_sitemap.txt', accumulate, function(err){
	if (err) {
		throw err;
	}
	console.log('Done!');
});

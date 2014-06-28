/*

Sitemap Generator
(c) Copyright 2014 All Rights Reserved by Joy Neop

*/

var siteDir = '/Users/JoyNeop/Developer/joyneop.github.io';
var accu = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

var fs = require('fs');

accu = accu + '\n' + fs.readFileSync(siteDir + '/root_sitemap.txt', 'utf8');
accu = accu + '\n' + fs.readFileSync(siteDir + '/blog/blog_sitemap.txt', 'utf8');
accu = accu + '\n' + fs.readFileSync(siteDir + '/lab/lab_sitemap.txt', 'utf8');

fs.writeFile(siteDir + '/sitemap.xml', accu + '\n</urlset>', function(err){
	if (err) {
		throw err;
	}
	console.log('Done!');
});
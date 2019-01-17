/*

Sitemap Generator
(c) Copyright 2014 All Rights Reserved by Joy Neop

*/

var siteDir = '/Users/Neruthes/Developer/neruthes.github.io';
var accu = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

var fs = require('fs');

accu = accu + '\n' + fs.readFileSync(siteDir + '/root_sitemap.xml', 'utf8');
accu = accu + '\n' + fs.readFileSync(siteDir + '/blog/blog_sitemap.xml', 'utf8');
accu = accu + '\n' + fs.readFileSync(siteDir + '/album/album_sitemap.xml', 'utf8');

fs.writeFileSync(siteDir + '/sitemap.xml', accu.replace(/\n/g, '\n\t') + '\n</urlset>');

console.log('Done!');

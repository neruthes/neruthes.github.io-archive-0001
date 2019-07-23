/*

Portfolio Sitemap Generator
Run on Node.js
(c) Copyright 2014 All Rights Reserved by Neruthes (a.k.a. Joy Neop)

*/

var thisDirPath = __dirname;
var postTemplate = '\n<url>\n\t<loc>__LOC__</loc>\n\t<priority>0.8</priority>\n</url>\n';
var listJson;
var accumulate = '';

var fs = require('fs');

listJson = JSON.parse(fs.readFileSync(thisDirPath + '/list.json', 'utf8').toString());
listJson.length = (function (list) {
    var count = 0;
    var i;
    for (i in list) {
        if (list.hasOwnProperty(i)) {
            count++;
        };
    };
    return count;
})(listJson);

var maxId = listJson.length-1;
for (var i = 0; i <= maxId && i < listJson.length; i++) {
	accumulate = postTemplate.replace(/__LOC__/g, 'https://joyneop.xyz/album/?p=' + i) + accumulate;
};


fs.writeFileSync(thisDirPath + '/album_sitemap.xml', accumulate);

console.log('Done!');

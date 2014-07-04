/*

Blog RSS Generator
Run on Node.js
(c) Copyright 2014 All Rights Reserved by Joy Neop

*/

var xmlTemplate = '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:sy="http://purl.org/rss/1.0/modules/syndication/" xmlns:slash="http://purl.org/rss/1.0/modules/slash/">\n<channel>\n<title>Joy Neop</title>\n<atom:link href="http://joyneop.xyz/blog/feed.rss" rel="self" type="application/rss+xml" />\n<link>http://joyneop.xyz/blog/</link>\n<description>Do what you want to do. Be what you want to be.</description>\n<lastBuildDate>{{DATE}} 09:41:00 +0000</lastBuildDate>\n<language>en-US</language>\n<sy:updatePeriod>hourly</sy:updatePeriod>\n<sy:updateFrequency>1</sy:updateFrequency>\n<generator>http://joyneop.github.io/blog/</generator>{{ITEMS}}</channel>\n</rss>';
var postTemplate = '<item>\n<title>{{TITLE}}</title>\n<link>{{URL}}</link>\n<pubDate>{{DATE}} 09:41:00 +0000</pubDate>\n<dc:creator><![CDATA[{{AUTHOR}}]]></dc:creator>\n<guid isPermaLink="false">{{URL}}</guid>\n<content:encoded>\n<![CDATA[\n{{POST}}\n]]>\n</content:encoded>\n</item>';
var blogPath = '/Users/JoyNeop/Developer/joyneop.github.io/blog';
var listJson;
var lastDate;
var accumulate = '';
var entireXml = '';

var fs = require('fs');

listJson = JSON.parse(fs.readFileSync(blogPath + '/list.json', 'utf8'));

for (var i = 0; i < listJson.list.length; i++) {
	accumulate = postTemplate.replace('{{AUTHOR}}', 'Joy Neop').replace('{{URL}}', 'http://joyneop.xyz/blog/?p=' + i).replace('{{TITLE}}', listJson.list[i]['Title']).replace('{{DATE}}', listJson.list[i]['Time']).replace('{{POST}}', fs.readFileSync(blogPath + '/db/' + i + '.txt', 'utf8')) + accumulate;
};

lastDate = listJson.list[(listJson.list.length-1)]['Time'];

entireXml = xmlTemplate.replace('{{ITEMS}}', accumulate).replace('{{DATE}}', lastDate);

fs.writeFile(blogPath + '/feed.rss', entireXml, function(err){
	if (err) {
		throw err;
	}
	console.log('Done!');
});
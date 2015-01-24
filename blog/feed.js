/*

Blog RSS Generator
Run on Node.js
(c) Copyright 2014 All Rights Reserved by Joy Neop

*/

var fs = require('fs');

var xmlTemplate = '<?xml version="1.0" encoding="UTF-8"?>\n\
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/"\n\
xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/"\n\
xmlns:atom="http://www.w3.org/2005/Atom" xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"\n\
xmlns:slash="http://purl.org/rss/1.0/modules/slash/">\n\
    <channel>\n\
        <title>Joy Neop</title>\n\
        <atom:link href="http://joyneop.xyz/blog/feed.rss" rel="self" type="application/rss+xml" />\n\
        <link>http://joyneop.xyz/blog/</link>\n\
        <description>Do what you want to do. Be what you want to be.</description>\n\
        <lastBuildDate>__DATE__ 09:41:00 +0000</lastBuildDate>\n\
        <language>en-US</language>\n\
        <sy:updatePeriod>hourly</sy:updatePeriod>\n\
        <sy:updateFrequency>1</sy:updateFrequency>\n\
	    <generator>http://joyneop.github.io/blog/</generator>\n\
__ITEMS__\n\
    </channel>\n\
</rss>';
var postTemplate = '        <item>\n\
            <title>__TITLE__</title>\n\
            <link>__URL__</link>\n\
            <pubDate>__DATE__ 09:41:00 +0000</pubDate>\n\
            <dc:creator><![CDATA[__AUTHOR__]]></dc:creator>\n\
            <guid isPermaLink="false">__URL__</guid>\n\
            <content:encoded>\n<![CDATA[\n__CONTENT__\n]]>\n\
            </content:encoded>\n\
        </item>\n';
var blogPath = __dirname;
var listJson;
var lastDate;
var accumulate = '';
var entireXml = '';

listJson = JSON.parse(fs.readFileSync(blogPath + '/list.json', 'utf8'));

var maxId = listJson.list.length-1;
for (var i = maxId; i > 0 && i > maxId-200; i--) {
	accumulate = accumulate + postTemplate.replace(/__AUTHOR__/g, 'Joy Neop')
	.replace(/__URL__/g, 'http://joyneop.xyz/blog/?p=' + i)
	.replace(/__TITLE__/g, listJson.list[i]['Title'])
	.replace(/__DATE__/g, listJson.list[i]['Time'])
	.replace(/__CONTENT__/g, fs.readFileSync(blogPath + '/db/' + i + '.txt', 'utf8'));
};

lastDate = listJson.list[(listJson.list.length-1)]['Time'];

entireXml = xmlTemplate
.replace(/__ITEMS__/g, accumulate)
.replace('__DATE__', lastDate);

fs.writeFileSync(blogPath + '/feed.rss', entireXml);

console.log('Done!');
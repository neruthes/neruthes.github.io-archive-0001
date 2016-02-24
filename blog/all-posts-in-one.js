/*

Static Blog Generator
(c) Copyright 2014 All Rights Reserved by Joy Neop

*/

var fs = require('fs');

var real = function (inpu) {
	return inpu.replace(/<\/p>[\n\s]*?<p>/g, '\n\n').replace(/<\/?p>/g, '\n').replace(/<br\s?\/>/g, '\n').replace(/<a.*?href="(.*?)".*?>(.*?)<\/a>/g, '[$2]($1)').replace(/<\/?em>/g, '*');
}

var blogPath = __dirname;

var htmlTemplate = fs.readFileSync(blogPath + '/index-template.txt').toString();
var postTemplate = fs.readFileSync(blogPath + '/post-template.txt').toString();
var listJson;
var accumulate = '';
var entireHtml = '';

listJson = JSON.parse(fs.readFileSync(blogPath + '/list.json', 'utf8').toString());

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
for (var i = 0; i <= maxId; i++) {
	if (listJson[i].D !== 0) {
		var title;
		if (listJson[i]['T'] == '') {
			title = '[ Untitied Post ]';
		} else {
			title = listJson[i]['T'];
		}
		accumulate = postTemplate.replace(/__neop.postId__/g, i).replace(/__neop.postTitle__/g, title).replace(/__neop.date__/g, listJson[i]['D']).replace(/__neop.postText__/g, real(fs.readFileSync(blogPath + '/db/' + i + '.txt', 'utf8').toString())) + accumulate;
	};
};

for (var i = 0; i < listJson.length; i++) {

};

entireHtml = htmlTemplate.replace('__neop.allPosts__', accumulate);

fs.writeFileSync(blogPath + '/all-posts-in-one.txt', entireHtml);

console.log('Done!');

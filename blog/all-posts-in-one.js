/*

Static Blog Generator
(c) Copyright 2014 All Rights Reserved by Joy Neop

*/

function real(inpu) {
	return inpu.replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/<br \/>/g, '\n');
}

var fs = require('fs');
var blogPath = '/Users/JoyNeop/Developer/joyneop.github.io/blog';

var htmlTemplate = fs.readFileSync(blogPath + '/index-template.txt').toString();
var postTemplate = fs.readFileSync(blogPath + '/post-template.txt').toString();
var metaJson;
var listJson;
var accumulate = '';
var entireHtml = '';

metaJson = JSON.parse(fs.readFileSync(blogPath + '/meta.json', 'utf8').toString());
listJson = JSON.parse(fs.readFileSync(blogPath + '/list.json', 'utf8').toString());

for (var i = 0; i < listJson.list.length; i++) {
	var title;
	if (listJson.list[i]['Title'] == '') {
		title = '[ Untitied Post ]';
	} else {
		title = listJson.list[i]['Title'];
	}
	accumulate = postTemplate.replace(/__neop.postId__/g, i).replace(/__neop.postTitle__/g, title).replace(/__neop.date__/g, listJson.list[i]['Time']).replace(/__neop.postText__/g, real(fs.readFileSync(blogPath + '/db/' + i + '.txt', 'utf8').toString())) + accumulate;
};

entireHtml = htmlTemplate.replace('__neop.allPosts__', accumulate);

fs.writeFile(blogPath + '/all-posts-in-one.txt', entireHtml, function(err){
	if (err) {
		throw err;
	}
	console.log('Done!');
});
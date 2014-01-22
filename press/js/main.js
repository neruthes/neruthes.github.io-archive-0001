/*----------------------------------------
Core file of NeopBlog
------------------------------------------
File meta info:
	File Name: main.js
	File Version: 0.9.2
	File Status: Beta
	File Branch: Master
------------------------------------------
NeopBlog developer meta info:
	Developer Name: Joy Neop
	Developer Website: http://www.joyneop.com/
	Developer Twitter: @joyneop
------------------------------------------
Copyright info:
	License Name: CC BY-NC-SA 4.0
	License Link: http://creativecommons.org/licenses/by-nc-sa/4.0/deed.en_US
----------------------------------------*/

var blogMetaData;
var ajaxContent;
ajaxContent = new XMLHttpRequest();

var ajaxMetaData;
ajaxMetaData = new XMLHttpRequest();
ajaxMetaData.open("GET", "./meta.json", false);
ajaxMetaData.send();

var ajaxList;
ajaxList = new XMLHttpRequest();
ajaxList.open("GET", "./list.json", false);
ajaxList.send();
var backList = ajaxList.responseText;
var postIndex = eval("(" + backList + ")");

var jsonMeta = ajaxMetaData.responseText;

blogMetaData = eval("(" + jsonMeta + ")");
var total = postIndex.list.length;
var blogName = blogMetaData.blogName;
var url = purl();

var postId = url.param("p");
var pageId = url.param("page");
var cateName = url.param("category");

var lastPage;
var theLatestPostId = total-1;

if (postId == undefined && pageId != undefined && cateName == undefined) {
	var prevpage = Number(pageId)+1;
	var nextpage = Number(pageId)-1;
	if (total%10 != 0) {
		lastPage = (total-(total%10))/10+1;
	} else {
		lastPage = (total-(total%10))/10;
	}
	if (lastPage == pageId && 1 != pageId) {
		var onLastPage = total%10;
		fillNav(prevpage, nextpage, 0, 1, "page");
		loadPage(pageId, onLastPage);
	} else if (1 == pageId && lastPage == pageId) {
		var onLastPage = total%10;
		fillNav(prevpage, nextpage, 0, 0, "page");
		loadPage(pageId, onLastPage);
	} else if (1 == pageId && lastPage != pageId) {
		fillNav(prevpage, nextpage, 1, 0, "page");
		loadPage(pageId, 10)
	} else {
		fillNav(prevpage, nextpage, 1, 1, "page");
		loadPage(pageId, 10)
	}
} else if (postId != undefined && pageId == undefined && cateName == undefined) {
	if (blogMetaData.comments == "on") {
		document.getElementById("comment-container").style.display = "block";
		document.getElementById("comment-container").style.visibility = "visible";
	}
	var prevpost = Number(postId)-1;
	var nextpost = Number(postId)+1;
	if (Number(postId) < total && Number(postId) >= 0) {
		loadPost(postId, 10, 1);
	}
	if (nextpost == total) {
		fillNav(prevpost, nextpost, 1, 0, "p");
	} else if (Number(postId) == 0) {
		fillNav(prevpost, nextpost, 0, 1, "p");
	} else if (Number(postId) < 0) {
		httpError("404");
	} else if (Number(postId) > theLatestPostId) {
		httpError("404");
	} else {
		fillNav(prevpost, nextpost, 1, 1, "p");
	}
} else if (postId == undefined && pageId == undefined && cateName == undefined) {
	loadPage(1, 10);
	fillNav(2, 0, 1, 0, "page");
} else if (postId == undefined && pageId == undefined && cateName != undefined) {
	httpError("404");
}

var jsonPost;
var ajaxContent;
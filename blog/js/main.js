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

var ajaxContent;
ajaxContent = new XMLHttpRequest();

var ajaxMetaData;
ajaxMetaData = new XMLHttpRequest();
ajaxMetaData.open("GET", "./meta.json", false);
ajaxMetaData.send();
var blogMetaData = eval("(" + ajaxMetaData.responseText + ")");

var ajaxList;
ajaxList = new XMLHttpRequest();
ajaxList.open("GET", "./list.json", false);
ajaxList.send();
var postIndex = eval("(" + ajaxList.responseText + ")");

var total = postIndex.list.length;
var blogName = blogMetaData.blogName;

var pageId = "NULL";
var postId = "NULL";

var loc = window.location.href;

if (loc.indexOf("?p=") != -1) {
	postId = Number(loc.slice(loc.indexOf("?") + 3));
} else if (loc.indexOf("?page=") != -1) {
	pageId = Number(loc.slice(loc.indexOf("?") + 6));
}

var lastPage;
var theLatestPostId = total-1;

if (postId == "NULL" && pageId != "NULL") {
	var prevpage = pageId+1;
	var nextpage = pageId-1;
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
		loadPage(pageId, 10);
	} else {
		fillNav(prevpage, nextpage, 1, 1, "page");
		loadPage(pageId, 10);
	}
} else if (postId != "NULL" && pageId == "NULL") {
	if (blogMetaData.comments == "on") {
		document.getElementById("comment-container").style.display = "block";
		document.getElementById("comment-container").style.visibility = "visible";
	}
	var prevpost = postId-1;
	var nextpost = postId+1;
	if (postId < total && postId >= 0) {
		loadPost(postId, 10, 1);
	}
	if (nextpost == total) {
		fillNav(prevpost, nextpost, 1, 0, "p");
	} else if (postId == 0) {
		fillNav(prevpost, nextpost, 0, 1, "p");
	} else if (postId < 0) {
		httpError("404");
	} else if (postId > theLatestPostId) {
		httpError("404");
	} else {
		fillNav(prevpost, nextpost, 1, 1, "p");
	}
} else if (postId == "NULL" && pageId == "NULL") {
	loadPage(1, 10);
	fillNav(2, 0, 1, 0, "page");
}

var jsonPost;
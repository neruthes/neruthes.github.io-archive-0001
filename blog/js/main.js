var ajaxList = new XMLHttpRequest();
ajaxList.open("GET", "./list.json", false);
ajaxList.send();
var postIndex = JSON.parse(ajaxList.responseText);

var total = postIndex.list.length;
var blogName = "Joy Neop";

var postId = "NULL";

var loc = window.location.href;
if (loc.indexOf("?p=") != -1) {
	postId = Number(loc.slice(loc.indexOf("?") + 3));
}

var lastPage;
var theLatestPostId = total-1;
var loadedOldestPostId = total;
var sectionsCreated = 0;

var cont = document.getElementById("cont");

if (postId != "NULL") {
	var prevpost = postId-1;
	var nextpost = postId+1;
	if (postId < total && postId >= 0) {
		createSection(postId);
		loadPost(postId);
	}
	if (nextpost == total) {
		fillNav(prevpost, nextpost, 1, 0);
	} else if (postId == 0) {
		fillNav(prevpost, nextpost, 0, 1);
	} else if (postId < 0 || postId > theLatestPostId) {
		httpError();
	} else {
		fillNav(prevpost, nextpost, 1, 1);
	}
} else if (postId == "NULL") {
	for (var i = total - 1; i >= total-10 && i >= 0; i--) {
		createSection(i);
		loadPost(i);
	}
	loadMultiPosts(loadedOldestPostId-1);
}
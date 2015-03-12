var createSection = function (pid) {
	var section = document.createElement("section");
	var h2 = document.createElement("h2");
	var h2a = document.createElement("a");
	var div = document.createElement("div");
	var footer = document.createElement("footer");
	var dateAndTime = document.createElement("a");
	section.setAttribute("class", "post");
	section.setAttribute("id", "post" + pid);
	h2.setAttribute("id", "post" + pid + "h2");
	h2.setAttribute("class", "post-h2");
	h2a.setAttribute("id", "post" + pid + "title");
	h2a.setAttribute("class", "post-h2-in");
	div.setAttribute("class", "post-text");
	div.setAttribute("id", "post" + pid + "text");
	dateAndTime.setAttribute("id", "post" + pid + "link");
	section.appendChild(h2);
	section.appendChild(footer);
	section.appendChild(div);
	h2.appendChild(h2a);
	footer.appendChild(dateAndTime);
	cont.appendChild(section);
	sectionsCreated++;
};

var loadPost = function (pid) {
	var thisId = sectionsCreated-1;
	ajaxContent[thisId] = new XMLHttpRequest();
	ajaxContent[thisId].open("GET", "db/" + pid + ".txt", true);
	ajaxContent[thisId].send();
	ajaxContent[thisId].onload = function () {
		var receivedPostText = ajaxContent[thisId].responseText;
		if (postIndex.list[pid].Title == "") {
			document.getElementById("post" + pid + "h2").remove();
		} else {
			document.getElementById("post" + pid + "h2").lang = postIndex.list[pid].Lang[0];
			document.getElementById("post" + pid + "title").innerHTML = postIndex.list[pid].Title;
			document.getElementById("post" + pid + "title").href = "./?p=" + pid;
		};
		if (receivedPostText == "") {
			document.getElementById("post" + pid + "text").remove();
		} else {
			document.getElementById("post" + pid + "text").innerHTML = receivedPostText;
		};
		document.getElementById("post" + pid + "text").lang = postIndex.list[pid].Lang[1];
		document.getElementById("post" + pid + "link").innerHTML = postIndex.list[pid].Time;
		document.getElementById("post" + pid + "link").href = "./?p=" + pid;
		if (postId != null && postIndex.list[pid].Title != "") {
			document.title = postIndex.list[pid].Title.replace(/<[\/a-z]*?>/g, '') + " — " + blogName;
		} else if (postId != null && postIndex.list[pid].Title == "") {
			document.title = "Post #" + pid + " — " + blogName;
		} else {
			document.title = blogName;
		};
		loadedOldestPostId--;
	};
};

var listOutPreviousPosts = function () {
	var section = document.createElement("section");
	var ul = document.createElement("ul");
	section.setAttribute("class", "post more");
	section.setAttribute("id", "more-posts");
	ul.setAttribute("class", "list");
	for (var i = total-11; i >= 0; i--) {
		var li = document.createElement("li");
		var a = document.createElement("a");
		var footer = document.createElement("footer");
		var fa = document.createElement("a");
		var div = document.createElement("div");
		if (postIndex.list[i].Title == null) {
			a.innerHTML = "[Untitled Post]";
		} else {
			a.innerHTML = postIndex.list[i].Title;
		};
		li.setAttribute("lang", postIndex.list[i].Lang[0]);
		a.setAttribute("href", "./?p=" + i);
		a.setAttribute("class", "post-h2");
		fa.setAttribute("href", "./?p=" + i);
		fa.innerHTML = postIndex.list[i].Time;
		footer.appendChild(fa);
		li.appendChild(a);
		li.appendChild(footer);
		ul.appendChild(li);
	};
	section.appendChild(ul);
	cont.appendChild(section);
};

var fillNav = function (previd, nextid) {
	if (previd != null) {
		document.getElementById("prevlink").href = "./?p=" + previd;
		document.getElementById("prevlink").innerHTML = "Prev »";
	} else {
		document.getElementById("prev").remove();
	};
	if (nextid != null) {
		document.getElementById("nextlink").href = "./?p=" + nextid;
		document.getElementById("nextlink").innerHTML = "« Next";
	} else {
		document.getElementById("next").remove();
	};
};

var httpError = function () {
	createSection(postId);
	document.getElementById("post" + postId + "title").innerHTML = "404 Not Found : (";
	document.getElementById("post" + postId + "link").remove();
	document.getElementById("prevandnext").innerHTML = "";
	document.title = "HTTP 404 " + "— " + blogName;
	document.getElementById("post" + postId + "text").innerHTML = "Here is nothing you can see. Back to <em><a href='./'>homepage</a></em>?";
};


var ajaxList = new XMLHttpRequest();
ajaxList.open("GET", "./list.json", false);
ajaxList.send();
var postIndex = JSON.parse(ajaxList.responseText);

var total = postIndex.list.length;
var blogName = "Joy Neop";
var ajaxContent = [];

var postId = null;

var loc = window.location.href;
if (loc.indexOf("?p=") != -1) {
	postId = Number(loc.slice(loc.indexOf("?") + 3));
};

var lastPage;
var theLatestPostId = total-1;
var loadedOldestPostId = total;
var sectionsCreated = 0;

var cont = document.getElementById("cont");

if (postId != null) {
	if (postId < total && postId >= 0) {
		createSection(postId);
		loadPost(postId);
	};
	if (postId == theLatestPostId) {
		fillNav(postId-1, null);
	} else if (postId == 0) {
		fillNav(null, postId+1);
	} else if (postId < 0 || postId > theLatestPostId) {
		httpError();
	} else {
		fillNav(postId-1, postId+1);
	};
} else if (postId == null) {
	for (var i = total - 1; i >= total-10 && i >= 0; i--) {
		createSection(i);
		loadPost(i);
	};
	listOutPreviousPosts();
};
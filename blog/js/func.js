/*----------------------------------------
Core file of NeopBlog
------------------------------------------
File meta info:
	File Name: func.js
	File Version: 0.9.0
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

function loadPost(pid, localport, ifPageTitle) {
	ajaxContent.open("GET", "db/" + pid + ".txt", false);
	ajaxContent.send();
	jsonPost = ajaxContent.responseText;

	if (postIndex.list[pid].postTitle == "") {
		document.getElementById("post" + localport + "h2").style.display = "none";
	} else {
		document.getElementById("post" + localport + "title").innerHTML = postIndex.list[pid].postTitle;
		document.getElementById("post" + localport + "title").href = "./?p=" + pid;
	}
	if (jsonPost == undefined) {
		document.getElementById("post" + localport + "text").style.display = "none";
	} else {
		document.getElementById("post" + localport + "text").innerHTML = jsonPost;
	}
	document.getElementById("post" + localport + "link").innerHTML = postIndex.list[pid].postDate;
	document.getElementById("post" + localport + "link").href = "./?p=" + pid;
	document.getElementById("post" + localport).style.display = "block";
	if (ifPageTitle == 1 && postIndex.list[pid].postTitle != undefined) {
		document.getElementById("page-title").innerHTML = postIndex.list[pid].postTitle + " — " + blogName;
	} else if (ifPageTitle == 1 && postIndex.list[pid].postTitle == undefined) {
		document.getElementById("page-title").innerHTML = "Post #" + pid + " — " + blogName;
	} else {
		document.getElementById("page-title").innerHTML = blogName;
	}
}

function fillNav(previd, nextid, ifprev, ifnext, type) {
	if (ifprev == 1) {
		document.getElementById("prevlink").href = "./?" + type + "=" + previd;
		document.getElementById("prevlink").innerHTML = "&lt; Prev";
		document.getElementById("prevlink").style.visibility = "visible";
	}
	if (ifnext == 1) {
		if (nextid == 1 && type == "page") {
			document.getElementById("nextlink").href = "./";
		} else {
			document.getElementById("nextlink").href = "./?" + type + "=" + nextid;
		}
		document.getElementById("nextlink").innerHTML = "Next &gt;";
		document.getElementById("nextlink").style.visibility = "visible";
	}
}

function loadPage(pageId, postsToLoad) {
	var topPostOnPage = total-1-10*(pageId-1);
	var postOnLoad = 10;
	postOnLoad = topPostOnPage;
	var bottomPort = 11-postsToLoad;
	for (var i = 10; i >= bottomPort; i--) {
		loadPost(postOnLoad, i, 0);
		postOnLoad--;
	}
}

function httpError(ecode) {
	document.getElementById("post10title").innerHTML = "HTTP " + ecode;
	document.getElementById("post10link").innerHTML = "";
	document.getElementById("prevandnext").innerHTML = "";
	document.getElementById("comment-container").innerHTML = "";
	document.getElementById("comment-container").style.display = "none";
	var info = "Unknown Issue...";
	document.getElementById("post10").style.display = "block";
	if (ecode == "404") {
		info = "The content you are requesting does not exist. Check your request please."
	} else if (ecode == "403") {
		info = "Firbidden. You are not allowed to see this."
	}
	document.getElementById("page-title").innerHTML = "HTTP " + ecode + "— " + blogName;
	document.getElementById("post10text").innerHTML = info;
}
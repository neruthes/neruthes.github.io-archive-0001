function retinaDidLoad() {
	document.getElementById("body").style.backgroundImage = "url(css/bg2.jpg)";
}

function createSection(pid) {
	var section = document.createElement("section");
	var h2 = document.createElement("h2");
	var h2a = document.createElement("a");
	var div = document.createElement("div");
	var footer = document.createElement("footer");
	var dateAndTime = document.createElement("a");
	section.setAttribute("class", "post");
	section.setAttribute("id", "post" + pid);
	h2.setAttribute("id", "post" + pid + "h2");
	h2a.setAttribute("id", "post" + pid + "title");
	div.setAttribute("class", "post-text");
	div.setAttribute("id", "post" + pid + "text");
	dateAndTime.setAttribute("id", "post" + pid + "link");
	section.appendChild(h2);
	section.appendChild(div);
	section.appendChild(footer);
	h2.appendChild(h2a);
	footer.appendChild(dateAndTime);
	cont.appendChild(section);
	sectionsCreated++;
}

function loadPost(pid) {
	var thisId = sectionsCreated-1;
	ajaxContent[thisId] = new XMLHttpRequest();
	ajaxContent[thisId].open("GET", "db/" + pid + ".txt", true);
	ajaxContent[thisId].send();
	ajaxContent[thisId].onload = function () {
		var receivedPostText = ajaxContent[thisId].responseText;
		if (postIndex.list[pid].Title == "") {
			document.getElementById("post" + pid + "h2").remove();
		} else {
			document.getElementById("post" + pid + "title").innerHTML = postIndex.list[pid].Title;
			document.getElementById("post" + pid + "title").href = "./?p=" + pid;
		}
		if (receivedPostText == "") {
			document.getElementById("post" + pid + "text").remove();
		} else {
			document.getElementById("post" + pid + "text").innerHTML = receivedPostText;
		}
		document.getElementById("post" + pid + "h2").lang = postIndex.list[pid].Lang[0];
		document.getElementById("post" + pid + "text").lang = postIndex.list[pid].Lang[1];
		document.getElementById("post" + pid + "link").innerHTML = postIndex.list[pid].Time;
		document.getElementById("post" + pid + "link").href = "./?p=" + pid;
		if (postId != "NULL" && postIndex.list[pid].Title != "") {
			document.title = postIndex.list[pid].Title + " — " + blogName;
		} else if (postId != "NULL" && postIndex.list[pid].Title == "") {
			document.title = "Post #" + pid + " — " + blogName;
		} else {
			document.title = blogName;
		}
		loadedOldestPostId--;
	};
}

function listOutPreviousPosts() {
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
		if (postIndex.list[i].Title == "") {
			a.innerHTML = "> Untitled post";
		} else {
			a.innerHTML = postIndex.list[i].Title;
		}
		li.setAttribute("lang", postIndex.list[i].Lang[0]);
		a.setAttribute("href", "./?p=" + i);
		fa.setAttribute("href", "./?p=" + i);
		fa.innerHTML = postIndex.list[i].Time;
		footer.appendChild(fa);
		li.appendChild(a);
		li.appendChild(footer);
		ul.appendChild(li);
	}
	section.appendChild(ul);
	cont.appendChild(section);
}

function fillNav(previd, nextid, ifprev, ifnext) {
	if (ifprev == 1) {
		document.getElementById("prevlink").href = "./?p=" + previd;
		document.getElementById("prevlink").innerHTML = "Prev »";
		document.getElementById("prevlink").style.visibility = "visible";
	}
	if (ifnext == 1) {
		if (nextid == 1) {
			document.getElementById("nextlink").href = "./";
		} else {
			document.getElementById("nextlink").href = "./?p=" + nextid;
		}
		document.getElementById("nextlink").innerHTML = "« Next";
		document.getElementById("nextlink").style.visibility = "visible";
	}
}

function httpError() {
	createSection(postId);
	document.getElementById("post" + postId + "title").innerHTML = "404 Not Found : (";
	document.getElementById("post" + postId + "title").style.display = "block";
	document.getElementById("post" + postId + "link").style.display = "none";
	document.getElementById("prevandnext").innerHTML = "";
	document.title = "HTTP 404 " + "— " + blogName;
	document.getElementById("post" + postId + "text").innerHTML = "Here is nothing you can see. Back to <em><a href='./'>homepage</a></em>?";
}
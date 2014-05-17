/*----------------------------------------
Core file of NeopWiki
------------------------------------------
File meta info:
	File Name: main.js
	File Version: 0.9.5
	File Status: Beta
	File Branch: Master
------------------------------------------
NeopWiki developer meta info:
	Developer Name: Joy Neop
	Developer Website: http://www.joyneop.com/
	Developer Twitter: @joyneop
------------------------------------------
Copyright info:
	License Name: CC BY-NC-SA 4.0
	License Link: http://creativecommons.org/licenses/by-nc-sa/4.0/deed.en_US
----------------------------------------*/

var postId = "NULL"
var blogName = ""
var loc = "_"

function loadPost(pid) {
	var ajaxContent = new XMLHttpRequest()
	ajaxContent.open("GET", "db/" + pid + ".txt", false)
	ajaxContent.send()
	var receivedPostText = ajaxContent.responseText
	document.getElementById("wiki-h2-a").innerHTML = pid.replace(/_/g, " ")
	document.getElementById("wiki-h2-a").href = "#" + pid
	document.title = pid.replace(/_/g, " ") + " — " + blogName

	var raw = receivedPostText
	var middle = raw
	while (middle.indexOf("\n\n\n") != -1) {
		middle = middle.replace("\n\n\n", "\n\n")
	}
	while (middle.indexOf("\n\n") == 0) {
		middle = middle.replace("\n\n", "")
	}
	var arr = middle.split("\n\n")
	var preview = document.getElementById("wiki-text")
	preview.innerHTML = ""
	for (var i = 0; i < arr.length; i++) {
		var p = document.createElement("p")
		p.innerHTML = arr[i]
		preview.appendChild(p)
	}
}

function loadWiki() {
	if (loc != window.location.href) {
		var ajaxMetaData = new XMLHttpRequest()
		ajaxMetaData.open("GET", "./meta.json", false)
		ajaxMetaData.send()
		var blogMetaData = JSON.parse(ajaxMetaData.responseText)
		blogName = blogMetaData.blogName
		loc = window.location.href
		if (loc.indexOf("#") != -1) {
			postId = loc.slice(loc.indexOf("#") + 1)
			loadPost(postId)
		} else {
			// postId = "Main_Page"
			window.location.replace(window.location.href + "#Main_Page")
		}
	}
}

loadWiki()

var wikiReload = window.setInterval(loadWiki, 30)
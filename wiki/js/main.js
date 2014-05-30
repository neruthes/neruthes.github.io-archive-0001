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
var ajaxMetaData = new XMLHttpRequest()
ajaxMetaData.open("GET", "./meta.json", false)
ajaxMetaData.send()
var blogMetaData = JSON.parse(ajaxMetaData.responseText)
blogName = blogMetaData.blogName

function loadPost(pid) {
	var ajaxContent = new XMLHttpRequest()
	ajaxContent.open("GET", "db/" + pid + ".txt", false)
	ajaxContent.send()
	if (ajaxContent.status != 404) {
		var receivedPostText = ajaxContent.responseText
	} else {
		var ajaxNotFound = new XMLHttpRequest()
		ajaxNotFound.open("GET", "nw/NeopWiki404.txt", false)
		ajaxNotFound.send()
		var receivedPostText = ajaxNotFound.responseText
	}
	document.getElementById("wiki-h2").innerHTML = pid.replace(/_/g, " ")
	document.title = pid.replace(/_/g, " ") + " — " + blogName

	var middle = receivedPostText
	while (middle.indexOf("\n\n\n") != -1) {
		middle = middle.replace("\n\n\n", "\n\n")
	}
	while (middle.indexOf("\n\n") == 0) {
		middle = middle.replace("\n\n", "")
	}
	var arr = middle.split("\n\n")
	var wikiText = document.getElementById("wiki-text")
	wikiText.innerHTML = ""
	for (var i = 0; i < arr.length; i++) {
		var p
		var wikiHeading = arr[i]
		if (wikiHeading.indexOf("# ") == 0) {
			p = document.createElement("h3")
			wikiHeading = wikiHeading.replace("# ", "")
		} else if (wikiHeading.indexOf("## ") == 0) {
			p = document.createElement("h4")
			wikiHeading = wikiHeading.replace("## ", "")
		} else if (wikiHeading.indexOf("### ") == 0) {
			p = document.createElement("h5")
			wikiHeading = wikiHeading.replace("### ", "")
		} else if (wikiHeading.indexOf("---") == 0 || wikiHeading.indexOf("* * *") == 0) {
			p = document.createElement("hr")
			wikiHeading = ""
		} else if (wikiHeading.indexOf(" ") == 0) {
			p = document.createElement("pre")
			wikiHeading = wikiHeading.slice(1)
		} else if (wikiHeading.indexOf("> ") == 0) {
			p = document.createElement("blockquote")
			wikiHeading = wikiHeading.slice(2)
		} else {
			p = document.createElement("p")
		}
		var wikiTemplates = wikiHeading
		while (wikiTemplates.indexOf("{{") != -1) {
			var tempUrl = wikiTemplates.slice((wikiTemplates.indexOf("{{") + 2), wikiTemplates.indexOf("}}"))
			var ajaxTemplate = new XMLHttpRequest()
			ajaxTemplate.open("GET", "tem/" + tempUrl.replace(/ /g, "_") + ".txt", false)
			ajaxTemplate.send()
			if (ajaxTemplate.status != 404) {
				var rawTemplateText = ajaxTemplate.responseText
			} else {
				var ajaxNotFound = new XMLHttpRequest()
				ajaxNotFound.open("GET", "nw/NeopWiki404.txt", false)
				ajaxNotFound.send()
				var rawTemplateText = ajaxNotFound.responseText
			}
			wikiTemplates = wikiTemplates.replace("{{" + tempUrl, rawTemplateText).replace("}}", '')
		}
		var wikiLinks = wikiTemplates
		while (wikiLinks.indexOf("[[") != -1) {
			var linkUrl = wikiLinks.slice((wikiLinks.indexOf("[[") + 2), wikiLinks.indexOf("]]"))
			wikiLinks = wikiLinks.replace("[[", '<a href="#' + linkUrl.replace(/ /g, "_") + '">').replace("]]", '</a>')
		}
		p.innerHTML = wikiLinks
		wikiText.appendChild(p)
	}
}

function loadWiki() {
	document.getElementById("cont").style.display = "none"
	loc = window.location.href
	if (loc.indexOf("#") != -1) {
		postId = loc.slice(loc.indexOf("#") + 1)
		loadPost(postId.split("")[0].toUpperCase() + postId.substring(1))
	} else {
		window.location.replace(window.location.href + "#Main_Page")
	}
	document.getElementById("cont").style.display = "block"
}

loadWiki()
window.onhashchange = loadWiki
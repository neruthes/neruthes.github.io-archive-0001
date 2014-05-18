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
	if (ajaxContent.status != 404) {
		var receivedPostText = ajaxContent.responseText
	} else {
		var ajaxNotFound = new XMLHttpRequest()
		ajaxNotFound.open("GET", "nw/Template_NeopWiki404.txt", false)
		ajaxNotFound.send()
		var receivedPostText = ajaxNotFound.responseText
	}
	document.getElementById("wiki-h2-a").innerHTML = pid.replace(/_/g, " ")
	document.getElementById("wiki-h2-a").href = "#" + pid
	document.title = pid.replace(/_/g, " ") + " — " + blogName

	var middle = receivedPostText
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
		var wikiTemplates = arr[i] //.replace(/\{\{/g, '<iframe src="').replace(/\}\}/g, '></iframe')
		while (wikiTemplates.indexOf("{{") != -1) {
			var tempUrl = wikiTemplates.slice((wikiTemplates.indexOf("{{") + 2), wikiTemplates.indexOf("}}"))
			var ajaxTemplate = new XMLHttpRequest()
			ajaxTemplate.open("GET", "db/Template_" + tempUrl.replace(/ /g, "_") + ".txt", false)
			ajaxTemplate.send()
			if (ajaxTemplate.status != 404) {
				var rawTemplateText = ajaxTemplate.responseText
			} else {
				var ajaxNotFound = new XMLHttpRequest()
				ajaxNotFound.open("GET", "nw/Template_NeopWiki404.txt", false)
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
		var p = document.createElement("p")
		p.innerHTML = wikiLinks
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
			loadPost(postId.split("")[0].toUpperCase() + postId.substring(1))
		} else {
			window.location.replace(window.location.href + "#Main_Page")
		}
	}
}

loadWiki()

var wikiReload = window.setInterval(loadWiki, 30)
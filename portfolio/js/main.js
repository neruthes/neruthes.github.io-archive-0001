window.app = {
	articlesList: null
};

app.getPID = function () {
	var PID = null;
	var loc = location.href.match(/\=(\d+)/);
	if (loc && loc.length > 0) {
		PID = Number(loc[1]);
		PID = isNaN(PID) ? null : PID;
	};
	return PID;
};

app.request = function (url, callback) {
	var http = new XMLHttpRequest();
	http.open('GET', url, true);
	http.onload = callback;
	http.send();
};

app.claimPrefetch = function (pid) {
	var link = document.createElement('link');
	link.setAttribute('rel', 'prefetch');
	link.setAttribute('href', '/portfolio/db/' + pid + '.txt');
	document.head.appendChild(link);
};

app.getNearbyPID = function (adj) {
	var pid = app.getPID() + adj;
	if (app.doesArticleExist(pid)) {
		return pid;
	} else {
		while (!app.doesArticleExist(pid)) {
			pid += adj;
		};
		return pid;
	};
};

app.getNextPID = function () {
	return app.getNearbyPID(1);
};

app.getPrevPID = function () {
	return app.getNearbyPID(-1);
};

app.articlesListResponseEventHandler = function (e) {
	app.articlesList = JSON.parse(e.target.responseText);
	app.articlesList.length = (function (list) {
		var count = 0;
		var i;
		for (i in list) {
		    if (list.hasOwnProperty(i)) {
		        count++;
		    };
		};
		return count;
	})(app.articlesList);
	[].forEach.call(app.articlesList, function (v, i) {
		app.claimPrefetch(i);
	});
	if ( app.getPID() == null ) {
		// PID is `null`
		document.getElementById('prevandnext').remove();
	} else {
		if (app.doesArticleExist(app.getPID())) {
			 if ( app.getPID() == 0 ) {
				// The initial article
				document.getElementById('prev').remove();
				document.getElementById('nextlink').href = './?p=' + (app.getNextPID()).toString();
				document.getElementById('nextlink').innerHTML = '« Next';
				app.claimPrefetch(app.getNextPID());
			} else if ( app.getPID() == app.articlesList.length-1 ) {
				// The latest article
				document.getElementById('next').remove();
				document.getElementById('prevlink').href = './?p=' + (app.getPrevPID()).toString();
				document.getElementById('prevlink').innerHTML = 'Prev »';
				app.claimPrefetch(app.getPrevPID());
			} else if ( 0 <= app.getPID() && app.getPID() < app.articlesList.length ) {
				// The article exists
				document.getElementById('prevlink').href = './?p=' + (app.getPrevPID()).toString();
				document.getElementById('prevlink').innerHTML = 'Prev »';
				app.claimPrefetch(app.getPrevPID());
				document.getElementById('nextlink').href = './?p=' + (app.getNextPID()).toString();
				document.getElementById('nextlink').innerHTML = '« Next';
				app.claimPrefetch(app.getNextPID());
			};
		} else {
			// Wrong URL
			document.getElementById('prevandnext').remove();
		};
	};
	app.main();
};

app.articleContentResponseEventHandlerConstructor = function (pid) {
	return function (e) {
		app.articleContentResponseEventHandler(e, pid);
	};
};

app.articleContentResponseEventHandler = function (e, targetPID) {
	document.getElementById('post__INDEX__text'.replace(/__INDEX__/, targetPID)).innerHTML = e.target.responseText;
};

app.loadTopPosts = function () {
	for (var i = app.articlesList.length-1; i > app.articlesList.length-11; i--) {
		if (app.doesArticleExist(i)) {
			app.request('./db/PID.txt'.replace(/PID/, i), app.articleContentResponseEventHandlerConstructor(i));
		};
	};
};

app.loadCurrentPost = function () {
	app.request('./db/PID.txt'.replace(/PID/, app.getPID()), app.articleContentResponseEventHandlerConstructor(app.getPID()));
};

app.doesArticleExist = function (pid) {
	console.log(pid);
	// if (app.articlesList[String(pid)]) {
	// 	if (app.articlesList[String(pid)].T !== 0) {
	// 		return true;
	// 	} else {
	// 		return false;
	// 	};
	// } else {
	// 	return false;
	// };
	console.log();
	return true;
};

app.main = function () {
	window.BlogContext = document.getElementById('cont');

	var regularPostSectionTemplate = '<section class="post" id="post__INDEX__"><div class="post-text" id="post__INDEX__text"></div></section>';
	var untitledPostSectionTemplate = '<section class="post" id="post__INDEX__"><div class="post-text" id="post__INDEX__text"></div></section>';
	var listItemTemplate = '<li><a href="./?p=__INDEX__" id="post__INDEX__h2" class="post-h2">__TITLE__</a><time class="post-date"><a id="post__INDEX__date" href="./?p=__INDEX__">__DATE__</a></time></li>';
	var listContainerTemplate = '<section class="post more" id="more-posts"><ul class="list">__CONTENT__</ul></section>';
	var stringInBlogContext = '';

	if ( app.getPID() == null ) {
		// This is the list of posts
		var listInBlogContext = '';

		for (var i = app.articlesList.length-1; i > app.articlesList.length-11; i--) {
			if (app.doesArticleExist(i)) {
				if (app.articlesList[String(i)].T) {
					stringInBlogContext += regularPostSectionTemplate.replace(/__INDEX__/g, i).replace(/__TITLE__/g, app.articlesList[String(i)].T ? app.articlesList[String(i)].T : '[Untitled Post]').replace(/__DATE__/g, app.articlesList[String(i)].D);
				} else {
					stringInBlogContext += untitledPostSectionTemplate.replace(/__INDEX__/g, i).replace(/__TITLE__/g, app.articlesList[String(i)].T ? app.articlesList[String(i)].T : '[Untitled Post]').replace(/__DATE__/g, app.articlesList[String(i)].D);
				};
			};
		};
		for (var i = app.articlesList.length-1-11; i > -1; i--) {
			if (app.doesArticleExist(i)) {
				listInBlogContext += listItemTemplate.replace(/__INDEX__/g, i).replace(/__TITLE__/g, app.articlesList[String(i)].T ? app.articlesList[String(i)].T : '[Untitled Post]').replace(/__DATE__/g, app.articlesList[String(i)].D);
			};
		};
		stringInBlogContext += listContainerTemplate.replace(/__CONTENT__/g, listInBlogContext);
		BlogContext.innerHTML = stringInBlogContext;
		app.loadTopPosts();
	} else {
		// This is a particular post
		if ( 0 <= app.getPID() && app.getPID() < app.articlesList.length && app.doesArticleExist(app.getPID())) {
			// This is a valid URL for a post
			var postTitle;
			if (app.articlesList[String(app.getPID())].T) {
				postTitle = app.articlesList[String(app.getPID())].T;
				stringInBlogContext = regularPostSectionTemplate.replace(/__INDEX__/g, app.getPID()).replace(/__TITLE__/g, app.articlesList[String(app.getPID())].T).replace(/__DATE__/g, app.articlesList[app.getPID()].D);
			} else {
				postTitle = '[Untitled Post]';
				stringInBlogContext = untitledPostSectionTemplate.replace(/__INDEX__/g, app.getPID()).replace(/__TITLE__/g, app.articlesList[String(app.getPID())].T).replace(/__DATE__/g, app.articlesList[app.getPID()].D);
			};
			document.title = postTitle + ' — Joy Neop';
			BlogContext.innerHTML = stringInBlogContext;
			app.loadCurrentPost(app.getPID());
		} else {
			// This post should not exist
			stringInBlogContext = regularPostSectionTemplate.replace(/__INDEX__/g, app.getPID()).replace(/__TITLE__/g, '404 Not Found');
			BlogContext.innerHTML = stringInBlogContext;
			document.getElementById('post__PID__text'.replace(/__PID__/, app.getPID())).innerHTML = '<p>The post does not exist : (</p>';
			document.getElementById('post__PID__link'.replace(/__PID__/, app.getPID())).remove();
		};
	};
};

// ----------------------------------------------------------------------------
// Start here

app.request('./list.json', app.articlesListResponseEventHandler);

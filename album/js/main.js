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
	link.setAttribute('href', '/album/db/' + pid + '.txt');
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

app.loadCurrentPost = function () {
	app.request('./db/PID.txt'.replace(/PID/, app.getPID()), app.articleContentResponseEventHandlerConstructor(app.getPID()));
};

app.doesArticleExist = function (pid) {
	console.log(pid);
	if (app.articlesList[String(pid)].T !== 0) {
		return true;
	} else {
		return false;
	};
};

app.main = function () {
	window.PortfolioContext = document.getElementById('cont');

	var regularItemEntryTemplate = '<section class="post" id="post__INDEX__"><div class="post-text" id="post__INDEX__text"></div></section>';
	var regularItemSectionTemplate = '<li class="entry" id="entry__INDEX__"><a class="entry-anchor" id="entry__INDEX__anchor" href="./?p=__INDEX__"><img class="entry-img" src="./covers/__INDEX__.jpg"></a></li>';
	var stringInPortfolioContext = '';

	if ( app.getPID() == null ) {
		// This is the list of posts
		document.body.setAttribute('page-mode', 'index');
		var listInPortfolioContext = '';

		for (var i = app.articlesList.length-1; i >= 0; i--) {
			if (app.doesArticleExist(i)) {
				stringInPortfolioContext += regularItemSectionTemplate.replace(/__INDEX__/g, i).replace(/__TITLE__/g, app.articlesList[String(i)].T ? app.articlesList[String(i)].T : '[Untitled Post]').replace(/__DATE__/g, app.articlesList[String(i)].D);
			};
		};
		PortfolioContext.innerHTML = stringInPortfolioContext + '<div style="clear: both;"></div>';
		window.setTimeout(function () {
			var itemEntries = document.getElementsByClassName('entry');
			for (var i = 0; i < itemEntries.length; i++) {
				(function (itemEntry, delay) {
					window.setTimeout(function () {
						itemEntry.classList.add('initialization-done');
					}, delay);
				})(itemEntries[i], i*60);
			};
		}, 900);
	} else {
		// This is a particular post
		document.body.setAttribute('page-mode', 'single');
		if ( 0 <= app.getPID() && app.getPID() < app.articlesList.length && app.doesArticleExist(app.getPID())) {
			// This is a valid URL for a post
			stringInPortfolioContext = regularItemEntryTemplate.replace(/__INDEX__/g, app.getPID()).replace(/__DATE__/g, app.articlesList[app.getPID()].D);
			document.title = app.articlesList[String(app.getPID())].T + ' — Joy Neop (a.k.a. Neruthes) Album';
			PortfolioContext.innerHTML = stringInPortfolioContext;
			app.loadCurrentPost(app.getPID());
		} else {
			// This post should not exist
			stringInPortfolioContext = regularItemSectionTemplate.replace(/__INDEX__/g, app.getPID()).replace(/__TITLE__/g, '404 Not Found');
			PortfolioContext.innerHTML = stringInPortfolioContext;
			document.getElementById('post__PID__text'.replace(/__PID__/, app.getPID())).innerHTML = '<p>The post does not exist : (</p>';
			document.getElementById('post__PID__link'.replace(/__PID__/, app.getPID())).remove();
		};
	};
};

// ----------------------------------------------------------------------------
// Start here

app.request('./list.json', app.articlesListResponseEventHandler);

window.blog = {
	articlesList: null
};

blog.getPID = function () {
	var PID = null;
	var loc = location.search.match(/[?&]p=(\d+)/);
	if (loc && loc.length > 0) {
		PID = Number(loc[1]);
		PID = isNaN(PID) ? null : PID;
	};
	return PID;
};

blog.request = function (url, callback) {
	var http = new XMLHttpRequest();
	http.open('GET', url, true);
	http.onload = callback;
	http.send();
};

blog.claimPrefetch = function (pid) {
	var link = document.createElement('link');
	link.setAttribute('rel', 'prefetch');
	link.setAttribute('href', '/blog/db/' + pid + '.txt');
	document.head.appendChild(link);
	var link2 = document.createElement('link');
	link2.setAttribute('rel', 'subresource');
	link2.setAttribute('href', '/blog/db/' + pid + '.txt');
	document.head.appendChild(link2);
};

blog.getNearbyPID = function (adj) {
	var pid = blog.getPID() + adj;
	if (blog.doesArticleExist(pid)) {
		return pid;
	} else {
		while (!blog.doesArticleExist(pid)) {
			pid += adj;
		};
		return pid;
	};
};

blog.getNextPID = function () {
	return blog.getNearbyPID(1);
};

blog.getPrevPID = function () {
	return blog.getNearbyPID(-1);
};

blog.articlesListResponseEventHandler = function (e) {
	blog.articlesList = JSON.parse(e.target.responseText);
	blog.articlesList.length = (function (list) {
		var count = 0;
		var i;
		for (i in list) {
		    if (list.hasOwnProperty(i)) {
		        count++;
		    };
		};
		return count;
	})(blog.articlesList);
	[].forEach.call(blog.articlesList, function (v, i) {
		blog.claimPrefetch(i);
	});
	if ( blog.getPID() == null ) {
		// PID is `null`
		document.getElementById('prevandnext').remove();
	} else {
		if (blog.doesArticleExist(blog.getPID())) {
			 if ( blog.getPID() == 0 ) {
				// The initial article
				document.getElementById('prev').remove();
				document.getElementById('nextlink').href = './?p=' + (blog.getNextPID()).toString();
				document.getElementById('nextlink').innerHTML = '‹ Next';
				blog.claimPrefetch(blog.getNextPID());
			} else if ( blog.getPID() == blog.articlesList.length-1 ) {
				// The latest article
				document.getElementById('next').remove();
				document.getElementById('prevlink').href = './?p=' + (blog.getPrevPID()).toString();
				document.getElementById('prevlink').innerHTML = 'Prev ›';
				blog.claimPrefetch(blog.getPrevPID());
			} else if ( 0 <= blog.getPID() && blog.getPID() < blog.articlesList.length ) {
				// The article exists
				document.getElementById('prevlink').href = './?p=' + (blog.getPrevPID()).toString();
				document.getElementById('prevlink').innerHTML = 'Prev ›';
				blog.claimPrefetch(blog.getPrevPID());
				document.getElementById('nextlink').href = './?p=' + (blog.getNextPID()).toString();
				document.getElementById('nextlink').innerHTML = '‹ Next';
				blog.claimPrefetch(blog.getNextPID());
			};
		} else {
			// Wrong URL
			document.getElementById('prevandnext').remove();
		};
	};
	blog.main();
};

blog.articleContentResponseEventHandlerConstructor = function (pid) {
	return function (e) {
		blog.articleContentResponseEventHandler(e, pid);
	};
};

blog.articleContentResponseEventHandler = function (e, targetPID) {
	document.getElementById('post__INDEX__text'.replace(/__INDEX__/, targetPID)).innerHTML = e.target.responseText;
};

blog.loadTopPosts = function () {
	for (var i = blog.articlesList.length-1; i > blog.articlesList.length-13; i--) {
		if (blog.doesArticleExist(i)) {
			blog.request('./db/PID.txt'.replace(/PID/, i), blog.articleContentResponseEventHandlerConstructor(i));
		};
	};
};

blog.loadCurrentPost = function () {
	blog.request('./db/PID.txt'.replace(/PID/, blog.getPID()), blog.articleContentResponseEventHandlerConstructor(blog.getPID()));
};

blog.doesArticleExist = function (pid) {
	if (blog.articlesList[String(pid)].T !== 0) {
		return true;
	} else {
		return false;
	};
};

blog.main = function () {
	window.BlogContext = document.getElementById('cont');

	var regularPostSectionTemplate = '<section class="post" id="post__INDEX__"><time class="post-date"><a id="post__INDEX__link" href="./?p=__INDEX__">__DATE__</a></time><h2 id="post__INDEX__h2" class="post-h2"><a id="post__INDEX__title" class="post-h2-in" href="./?p=__INDEX__">__TITLE__</a></h2><div class="post-text" id="post__INDEX__text"></div></section>';
	var untitledPostSectionTemplate = '<section class="post" id="post__INDEX__"><time class="post-date"><a id="post__INDEX__link" href="./?p=__INDEX__">__DATE__</a></time><div class="post-text" id="post__INDEX__text"></div></section>';
	var listItemTemplate = '<li><time class="post-date"><a id="post__INDEX__date" href="./?p=__INDEX__">__DATE__</a></time><a href="./?p=__INDEX__" id="post__INDEX__h2" class="post-h2">__TITLE__</a></li>';
	var listContainerTemplate = '<section class="post more" id="more-posts"><ul class="list">__CONTENT__</ul></section>';
	var stringInBlogContext = '';

	if ( blog.getPID() == null ) {
		// This is the list of posts
		var listInBlogContext = '';

		for (var i = blog.articlesList.length-1; i > blog.articlesList.length-13; i--) {
			if (blog.doesArticleExist(i)) {
				if (blog.articlesList[String(i)].T) {
					stringInBlogContext += regularPostSectionTemplate.replace(/__INDEX__/g, i).replace(/__TITLE__/g, blog.articlesList[String(i)].T ? blog.articlesList[String(i)].T : '[Untitled Post]').replace(/__DATE__/g, blog.articlesList[String(i)].D);
				} else {
					stringInBlogContext += untitledPostSectionTemplate.replace(/__INDEX__/g, i).replace(/__TITLE__/g, blog.articlesList[String(i)].T ? blog.articlesList[String(i)].T : '[Untitled Post]').replace(/__DATE__/g, blog.articlesList[String(i)].D);
				};
			};
		};
		for (var i = blog.articlesList.length-1-12; i > -1; i--) {
			if (blog.doesArticleExist(i)) {
				listInBlogContext += listItemTemplate.replace(/__INDEX__/g, i).replace(/__TITLE__/g, blog.articlesList[String(i)].T ? blog.articlesList[String(i)].T : '[Untitled Post]').replace(/__DATE__/g, blog.articlesList[String(i)].D);
			};
		};
		stringInBlogContext += listContainerTemplate.replace(/__CONTENT__/g, listInBlogContext);
		BlogContext.innerHTML = stringInBlogContext;
		blog.loadTopPosts();
	} else {
		// This is a particular post
		if ( 0 <= blog.getPID() && blog.getPID() < blog.articlesList.length && blog.doesArticleExist(blog.getPID())) {
			// This is a valid URL for a post
			var postTitle;
			if (blog.articlesList[String(blog.getPID())].T) {
				postTitle = blog.articlesList[String(blog.getPID())].T;
				stringInBlogContext = regularPostSectionTemplate.replace(/__INDEX__/g, blog.getPID()).replace(/__TITLE__/g, blog.articlesList[String(blog.getPID())].T).replace(/__DATE__/g, blog.articlesList[blog.getPID()].D);
			} else {
				postTitle = '[Untitled Post]';
				stringInBlogContext = untitledPostSectionTemplate.replace(/__INDEX__/g, blog.getPID()).replace(/__TITLE__/g, blog.articlesList[String(blog.getPID())].T).replace(/__DATE__/g, blog.articlesList[blog.getPID()].D);
			};
			document.title = postTitle + ' — Joy Neop (a.k.a. Neruthes)';
			BlogContext.innerHTML = stringInBlogContext;
			blog.loadCurrentPost(blog.getPID());
		} else {
			// This post should not exist
			stringInBlogContext = regularPostSectionTemplate.replace(/__INDEX__/g, blog.getPID()).replace(/__TITLE__/g, '404 Not Found');
			BlogContext.innerHTML = stringInBlogContext;
			document.getElementById('post__PID__text'.replace(/__PID__/, blog.getPID())).innerHTML = '<p>The post does not exist : (</p>';
			document.getElementById('post__PID__link'.replace(/__PID__/, blog.getPID())).remove();
		};
	};
};

// ----------------------------------------------------------------------------
// Start here

blog.request('./list.json', blog.articlesListResponseEventHandler);

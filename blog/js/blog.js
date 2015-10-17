window.blog = {
	articlesList: null
};

blog.getPID = function () {
	var PID = null;
	var loc = location.href.match(/\=(\d+)$/);
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
};

blog.articlesListResponseEventHandler = function (e) {
	blog.articlesList = JSON.parse(e.target.responseText);
	[].forEach.call(blog.articlesList.list, function (v, i) {
		blog.claimPrefetch(i);
	});
	if ( blog.getPID() == null ) {
		// PID is `null`
		document.getElementById('prevandnext').remove();
	} else {
		if ( blog.getPID() == 0 ) {
			// The initial article
			document.getElementById('prev').remove();
			document.getElementById('nextlink').href = './?p=' + (blog.getPID()+1).toString();
			document.getElementById('nextlink').innerHTML = '« Next';
			blog.claimPrefetch(blog.getPID()+1);
		} else if ( blog.getPID() == blog.articlesList.list.length-1 ) {
			// The latest article
			document.getElementById('next').remove();
			document.getElementById('prevlink').href = './?p=' + (blog.getPID()-1).toString();
			document.getElementById('prevlink').innerHTML = 'Prev »';
			blog.claimPrefetch(blog.getPID()-1);
		} else if ( 0 <= blog.getPID() && blog.getPID() < blog.articlesList.list.length ) {
			// The article exists
			document.getElementById('prevlink').href = './?p=' + (blog.getPID()-1).toString();
			document.getElementById('prevlink').innerHTML = 'Prev »';
			blog.claimPrefetch(blog.getPID()-1);
			document.getElementById('nextlink').href = './?p=' + (blog.getPID()+1).toString();
			document.getElementById('nextlink').innerHTML = '« Next';
			blog.claimPrefetch(blog.getPID()+1);
		} else {
			// Wrong URL
			document.getElementById('prevandnext').remove();
		};
	};
	blog.main();
};

blog.articleContentResponseEventHandler = function (e, targetPID) {
	document.getElementById('post__INDEX__text'.replace(/__INDEX__/, targetPID)).innerHTML = e.target.responseText;
};

blog.loadTopPosts = function () {
	for (var i = blog.articlesList.list.length-1; i > blog.articlesList.list.length-11; i--) {
		blog.request('./db/PID.txt'.replace(/PID/, i), (function (pid) {
			return function (e) {
				blog.articleContentResponseEventHandler(e, pid);
			};
		})(i));
	};
};

blog.loadCurrentPost = function () {
	blog.request('./db/PID.txt'.replace(/PID/, blog.getPID()), (function (pid) {
		return function (e) {
			blog.articleContentResponseEventHandler(e, pid);
		};
	})(blog.getPID()));
};

blog.main = function () {
	window.BlogContext = document.getElementById('cont');

	var sectionTemplate = '<section class="post" id="post__INDEX__"><h2 id="post__INDEX__h2" class="post-h2"><a id="post__INDEX__title" class="post-h2-in" href="./?p=__INDEX__">__TITLE__</a></h2><footer class="post-footer"><a id="post__INDEX__link" href="./?p=__INDEX__">__DATE__</a></footer><div class="post-text" id="post__INDEX__text"></div></section>';
	var listItemTemplate = '<li><a href="./?p=__INDEX__" id="post__INDEX__h2" class="post-h2">__TITLE__</a><footer class="post-footer"><a id="post__INDEX__footer" href="./?p=__INDEX__">__DATE__</a></footer></li>';
	var listContainerTemplate = '<section class="post more" id="more-posts"><ul class="list">__CONTENT__</ul></section>';
	var stringInBlogContext = '';

	if ( blog.getPID() == null ) {
		// This is the list of posts
		var listInBlogContext = '';

		for (var i = blog.articlesList.list.length-1; i > blog.articlesList.list.length-11; i--) {
			stringInBlogContext += sectionTemplate.replace(/__INDEX__/g, i).replace(/__TITLE__/g, blog.articlesList.list[i].T ? blog.articlesList.list[i].T : '[Untitled Post]').replace(/__DATE__/g, blog.articlesList.list[i].D);
		};
		for (var i = blog.articlesList.list.length-1-11; i > -1; i--) {
			listInBlogContext += listItemTemplate.replace(/__INDEX__/g, i).replace(/__TITLE__/g, blog.articlesList.list[i].T ? blog.articlesList.list[i].T : '[Untitled Post]').replace(/__DATE__/g, blog.articlesList.list[i].D);
		};
		stringInBlogContext += listContainerTemplate.replace(/__CONTENT__/g, listInBlogContext);
		BlogContext.innerHTML = stringInBlogContext;
		blog.loadTopPosts();
	} else {
		// This is a particular post
		if ( 0 <= blog.getPID() && blog.getPID() < blog.articlesList.list.length ) {
			// This is a valid URL for a post
			document.title = blog.articlesList.list[blog.getPID()].T + ' — Joy Neop';
			stringInBlogContext = sectionTemplate.replace(/__INDEX__/g, blog.getPID()).replace(/__TITLE__/g, blog.articlesList.list[blog.getPID()].T).replace(/__DATE__/g, blog.articlesList.list[blog.getPID()].D);
			BlogContext.innerHTML = stringInBlogContext;
			blog.loadCurrentPost(blog.getPID());
		} else {
			// This post should not exist
			stringInBlogContext = sectionTemplate.replace(/__INDEX__/g, blog.getPID()).replace(/__TITLE__/g, '404 Not Found');
			BlogContext.innerHTML = stringInBlogContext;
			document.getElementById('post__PID__text'.replace(/__PID__/, blog.getPID())).innerHTML = '<p>The post does not exist : (</p>';
			document.getElementById('post__PID__link'.replace(/__PID__/, blog.getPID())).remove();
		};
	};
};

// ----------------------------------------------------------------------------
// Start here

blog.request('./list.json', blog.articlesListResponseEventHandler);

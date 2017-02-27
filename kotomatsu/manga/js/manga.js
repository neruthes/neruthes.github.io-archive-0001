window.blog = {
	articlesList: null
};

blog.getPID = function () {
	var PID = null;
	var loc = location.href.match(/\=(\d+)/);
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
	link.setAttribute('href', '/kotomatsu/manga/db/' + pid + '.png');
	document.head.appendChild(link);
	var link2 = document.createElement('link');
	link2.setAttribute('rel', 'subresource');
	link2.setAttribute('href', '/kotomatsu/manga/db/' + pid + '.png');
	document.head.appendChild(link2);
};

blog.getNearbyPID = function (adj) {
	var pid = blog.getPID() + adj;
	return pid;
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
		if ( blog.articlesList.length == 1) {
			// The only article
			document.getElementById('prev').remove();
			document.getElementById('next').remove();
		} else if ( blog.getPID() == 0 ) {
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
	};
	blog.main();
};

blog.main = function () {
	window.BlogContext = document.getElementById('cont');

	var regularPostSectionTemplate = '<figure class="figure"><img src="/kotomatsu/manga/img/TKM%20__INDEX__.png"></figure>';
	var stringInBlogContext = '';

	if ( blog.getPID() == null ) {
		// Redirect to the latest post
		location.replace('/kotomatsu/manga/?p=' + (blog.articlesList.length-1));
	} else {
		// This is a particular post
		if ( 0 <= blog.getPID() && blog.getPID() < blog.articlesList.length ) {
			// This is a valid URL for a post
			var postTitle;
			postTitle = blog.articlesList[String(blog.getPID())].T;
			stringInBlogContext = regularPostSectionTemplate.replace(/__INDEX__/g, blog.getPID()).replace(/__TITLE__/g, blog.articlesList[String(blog.getPID())].T).replace(/__DATE__/g, blog.articlesList[blog.getPID()].D);
			document.title = postTitle + ' — The Kotomatsu Manga';
			BlogContext.innerHTML = stringInBlogContext;
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

blog.request('/kotomatsu/manga/list.json', blog.articlesListResponseEventHandler);

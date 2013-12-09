# NeopBlog v0.9.1 Beta #

<table>
	<tr>
		<th>Key</th><th>Value</th>
	</tr>
	<tr>
		<td>Version</td><td>0.9.1</td>
	</tr>
	<tr>
		<td>Build</td><td>100A42</td>
	</tr>
	<tr>
		<td>Status</td><td>Beta</td>
	</tr>
</table>

NeopBlog is a light blog CMS initially developed by Joy Neop, with a feature that it’s easy to build a simple blog with only static files and visitors access the posts via AJAX and JSON. This help the blog owner a easy way to post, but disadvantages are too apparent to make NeopBlog meet all bloggers’ demand.

## How To Use ##

### Designed For Whom ###

In advance, as a user, instead of a developer, you should know how to:
* Write HTML (because no built-in visual editor)
* Write CSS (optional)
* Avoid breaking JSON syntax.
* ~~Create a repository on GitHub~~
* ~~Commit to a branch on GitHub~~
* ~~Generate GitHub Pages~~

### Installing ###

Find the file named `meta.json` and edit it, to set how many posts do you have. Notice that your first post’s ID is 0, and `totalPosts` is equal to the ID of your latest plus 1. It it not recommended to start a blog with NeopBlog, because you must have at least 11 posts or unknown bug may appear.

Then edit `index.html`, the only HTML document of NeopBlog. You can change the content of elements whose class are `global`, which is the only way to configure your blog.

#### Installing On GitHub ####

Firstly you are supposed to create a repository. For example, since my GitHub username is `JoyNeop`, my repository should be named `joyneop.github.io`. And the you need to set up DNS record. For me, I want to use `blog.joyneop.com` for this, I am supposed to set a `CNAME` record which refer `blog.joyneop.com` to `joyneop.github.io`. If you want to use root domain, follow the official instruction at `https://help.github.com/articles/setting-up-a-custom-domain-with-pages`.

Then, find the file `CNAME` in root directory and edit it. There should be one line content disclaiming your domain.

#### Installing On Independent Web Host ####

I think you know what to do, as same as how you install WordPress or MediaWiki, though no need to configure database settings.

### Posting ###

If you have already had 41 posts, when you want to publish the 42nd post you just need to upload a JSON file which contains the post and named `41.json` to `db` directory and change the value of key `totalPosts` in `meta.json`.

Inside of a JSON file of the post which is represented, for example, `0.json` contains three key namely `postTitle`, `postText` and `postDate`.

The value of key `postTitle` will be filled into an `<h2>` element so there is no need to write `<h2>` and `</h2>` and the beginning and the end of the value.

Yet the value of key `postText` will be filled into an `<div>` element so that you have to write heads and ends of every element you need and handle the HTML code solely. It’s not a bug, but a feature which can make you more arbitrarily control your HTML micro structure as you want.

Finally the value of key “postDate” is not analyzed so that you can write in any form. Both `Jan 24, 1984` and `1984/01/24` are okay. Even you can give up insisting a single form. Strictly, this it not quite limited to set a date, instead, it can be used as a highly customized post footer.

### Themes ###

A theme is divided into three files, including `theme_common.css`, `theme_desktop.css`, and `theme_mobile.css`.

As a user, you just need to replace the three CSS files with another suit which is a theme. As a developer, you can read default theme to understand what structure is suggested and you will be able to write your theme.

## Credits ##

Thanks for those who provides technical wheels:

* Purl.js

## Copyright & License ##

Currently NeopBlog is neither a free software nor a open source software, though it is really easy to view and understand all codes. But I promise I will release NeopBlog under `CC BY-NC-SA 4.0 license` after finishing all features.

## Features On To-do List ##

* Categories
* Disqus support

## Features Not On To-do List ##

* Tags
* Comments
* Pingback
* RSS
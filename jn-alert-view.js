(function(alert, text, quadrant, position, style, size){
	/*
	@Author Joy Neop
	@Website http://www.joyneop.com/
	@GitHub https://github.com/JoyNeop
	@Twitter https://twitter.com/JoyNeop
	@Email i@joyneop.com
	© 2014 Joy Neop. All rights reserved.
	*/
	window.jnalert = {};

	if (quadrant == undefined || quadrant == null) {
		quadrant = 1;
	}
	if (position == undefined || position == null) {
		position = "absolute";
	}
	if (style == undefined || style == null) {
		style = "color: #FFF !important; background: rgba(0, 0, 0, 0.222); border-radius: 3px; opacity: 1;";
	}
	if (size == undefined || size == null) {
		size = [ 320, 32, 362, 60 ];
	}

	// CSS
	var sizeText = [ "width: " + size[0] + "px; height: " + size[1] + "px; ", "width: " + size[2] + "px; height: " + size[3] + "px; "];
	var divId = "jn-alert-3389";
	window.jnalert.divId = "jn-alert-3389";
	var styleText = "#" + divId + " { " + style + " }";
	var corner;
	if (quadrant == 1) {
		corner = "top: 15px; right: 15px;";
	} else if (quadrant == 2) {
		corner = "top: 15px; left: 15px;";
	} else if (quadrant == 3) {
		corner = "bottom: 15px; left: 15px;";
	} else {
		// if (quadrant == 4)
		corner = "bottom: 15px; right: 15px;";
	}
	var preStyle = "#jn-alert-3389 { position: " + position + "; " + corner + sizeText[0] + " z-index: 9999; box-sizing: border-box; max-width: 390px; font-size: 15px; font-weight: normal; line-height: 20px; letter-spacing: 0; overflow: hidden; -webkit-transition: all 300ms ease; -moz-transition: all 300ms ease; transition: all 300ms ease; } #jn-alert-3389 span { padding: 6px 14px; box-sizing: border-box; } #jn-alert-3389 span * { color: inherit; text-decoration: inherit; }";
	var extraStyle = "#jn-alert-3389 span:first-child { display: block; } #jn-alert-3389 span:last-child { display: none; } #jn-alert-3389:hover { opacity: 1; " + sizeText[1] + " } #jn-alert-3389:hover span:first-child { display: none; } #jn-alert-3389:hover span:last-child { display: block; }";
	var styleTag = document.createElement("style");
	styleTag.setAttribute("id", divId + "style");
	window.jnalert.styleTagContent = preStyle + styleText + extraStyle;
	styleTag.appendChild(document.createTextNode(window.jnalert.styleTagContent));
	document.getElementsByTagName("head")[0].appendChild(styleTag);

	// DOM
	var div = document.createElement("div");
	var s1 = document.createElement("span");
	s1.innerHTML = alert;
	var s2 = document.createElement("span");
	s2.innerHTML = text;
	s2.style = sizeText[1];
	div.setAttribute("id", divId);
	div.setAttribute("style", "font-size: 15px;");
	div.appendChild(s1);
	div.appendChild(s2);
	document.body.appendChild(div);

	// Time
	window.jnalert.show = function () {
		document.getElementById(window.jnalert.divId + "style").innerHTML = window.jnalert.styleTagContent + "#" + window.jnalert.divId + " { opacity: 1; }";
	};
	window.jnalert.dim = function () {
		document.getElementById(window.jnalert.divId + "style").innerHTML = window.jnalert.styleTagContent + "#" + window.jnalert.divId + " { opacity: 0.05; }";
	};
	window.setTimeout(window.jnalert.show, 4);
	window.setTimeout(window.jnalert.dim, 2200);
	console.log(alert);
	console.log(text);
})("Hi, I'm seeking 2015 summer internship...", "<a href='http://neopstudio.github.io/resume/' style='display: block; width: 364px;' target='_blank'>Does your company have an internship program? Maybe I can be one in your company this summer? Click here to see my résumé, thanks : )</a>", 1, "absolute", null, [ 320, 32, 390, 72 ]);

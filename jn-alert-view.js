(function(alert, text, quadrant, position, style){
	if (quadrant == undefined) {
		quadrant = 1;
	}
	if (position == undefined) {
		position = "absolute";
	}
	if (style == undefined) {
		style = "color: #FFF; padding: 8px 14px; background: rgba(128, 128, 128, 0.75); border: 1px solid #AAA; border-radius: 3px;";
	}

	// CSS
	var ran = Math.round(Math.random()*200)+500;
	var divId = "jn-alert-" + ran;
	var styleText = "#" + divId + " { " + style + " }";
	var corner;
	if (quadrant == 1) {
		corner = "top: 15px; right: 15px;";
	} else if (quadrant == 2) {
		corner = "top: 15px; left: 15px;";
	} else if (quadrant == 3) {
		corner = "bottom: 15px; left: 15px;";
	} else {
		corner = "bottom: 15px; right: 15px;";
	}
	var preStyle = "#" + divId + " { position: " + position + "; " + corner + " max-width: 360px; font-size: 15px; } #" + divId + " span * { color: inherit; text-decoration: inherit; }";
	var es = "#JNALERTDIVID span:last-child { display: none; } #JNALERTDIVID:hover { opacity: 1; } #JNALERTDIVID:hover span:first-child { display: none; } #JNALERTDIVID:hover span:last-child { display: inline; }";
	extraStyle = es.replace(/JNALERTDIVID/g, divId);
	var styleTag = document.createElement("style");
	styleTag.appendChild(document.createTextNode(preStyle + styleText + extraStyle));
	document.getElementsByTagName("head")[0].appendChild(styleTag);

	// DOM
	var div = document.createElement("div");
	var s1 = document.createElement("span");
	s1.innerHTML = alert;
	var s2 = document.createElement("span");
	s2.innerHTML = text;
	div.setAttribute("id", divId);
	div.appendChild(s1);
	div.appendChild(s2);
	document.body.appendChild(div);
})("I'm seeking 2015 summer internship...", "<a href='http://neopstudio.github.io/resume/'>Does your company have a internship program? Maybe I can be one in your company this summer? Click here to see my resume, thanks : )</a>", 1, "absolute", "color: #FDFDFD; padding: 8px 14px; background: rgba(0, 0, 0, 0.55); border-radius: 3px; box-shadow: rgba(0, 0, 0, 0.35) 0 2px 10px; opacity: 0.7");
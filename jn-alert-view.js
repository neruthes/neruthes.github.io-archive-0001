(function(alert, text, quadrant, position, style){
	if (quadrant == undefined) {
		quadrant = 1;
	}
	if (position == undefined) {
		position = "absolute";
	}
	if (style == undefined) {
		style = "color: #FAFAFA; padding: 6px 14px; background: rgba(0, 0, 0, 0.273); border-radius: 3px; opacity: 1;";
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
		// if (quadrant == 4)
		corner = "bottom: 15px; right: 15px;";
	}
	var preStyle = "#" + divId + " { position: " + position + "; " + corner + " z-index: 9999; box-sizing: border-box; max-width: 390px; font-size: 15px; font-weight: 400; } #" + divId + " span * { color: inherit; text-decoration: inherit; }";
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
})("Hi, I'm seeking 2015 summer internship...", "<a href='http://neopstudio.github.io/resume/' target='_blank'>Does your company have an internship program? Maybe I can be one in your company this summer? Click here to see my resume, thanks : )</a>", 4, "absolute");
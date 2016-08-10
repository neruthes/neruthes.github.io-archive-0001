(function (dd) {
    if (dd.getMonth() === 3 && dd.getDay() === 1) {
        var st = document.createElement('style');
        st.innerHTML = 'html, body, h1, h2, h3, h4, h5, h6, div, article, section, header, footer, nav, p, span, strong, em, button, label, input, textarea, form { font-family: "Comic Sans MS", Seravek, "Open Sans", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", sans-serif !important; }'
        document.head.appendChild(st);
    };
})(new Date());

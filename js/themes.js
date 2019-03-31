window.addEventListener('load', function () {
    (function () {
        if (location.href.match(/[?&]theme=(\w+?)/)) {
            window.mandatoryTheme = location.href.match(/[?&]theme=(\w+?)/)[1];
        } else {
            window.mandatoryDate = false;
        };
        if (location.href.match(/[?&]date=(\d{8})/)) {
            window.mandatoryDate = location.href.match(/[?&]date=(\d{8})/)[1];
            var d = (new Date(`${mandatoryDate.slice(0,4)}/${mandatoryDate.slice(4,6)}/${mandatoryDate.slice(6,8)} 12:31:00`));
        } else {
            window.mandatoryDate = false;
            var d = new Date();
        };
        var yyyy = d.getFullYear();

        window.themes = {
            'aprilfool': {
                paths: [
                    /.+/
                ],
                preventedPaths: [],
                dateRange: [ 'Mar 31', 'Apr 04' ],
                action: function () {
                    var st = document.createElement('style');
                    st.innerHTML = 'html, body, h1, h2, h3, h4, h5, h6, div, article, section, header, footer, nav, p, pre, code, span, strong, em, button, label, input, textarea, form { font-family: "Comic Sans MS", Seravek, "Open Sans", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", sans-serif !important; }'
                    document.head.appendChild(st);
                }
            },
            'chunjie': {
                paths: [
                    /^\/$/,
                    /^\/blog\//,
                    /^\/album\//
                ],
                preventedPaths: [
                    /album.+?[?&]p=\d+/
                ],
                dateRange: [ 'Jan 01', 'Mar 01' ],
                action: function () {
                    if (location.pathname !== '/') {
                        document.body.setAttribute('data-should-always-hide-hengpi', 'true');
                    };

                    var linkTag = document.createElement('link');
                    linkTag.setAttribute('rel', 'stylesheet');
                    linkTag.setAttribute('href', '/css/chunjie.css');
                    document.head.appendChild(linkTag);

                    var makeElement = function (align) {
                        var div = document.createElement('div');
                        div.setAttribute('class', `desktop-only chunlian vertical ${align}`);
                        div.setAttribute('style', `position: fixed; top: 2vh; height: 96vh; ${align}: 2vh;`)
                        div.setAttribute('onclick', 'return false');
                        var img = document.createElement('img');
                        img.setAttribute('src', `/JN-Lab/other-images/kotomatsu-chunlian-${align}.jpg`);
                        img.setAttribute('style', `height: 100%; display: block; margin: 0 auto;`);
                        img.setAttribute('data-rotation', 'Y0');
                        img.setAttribute('data-scale', '1.00');
                        img.setAttribute('onclick', 'return false');
                        div.appendChild(img);
                        return div;
                    };
                    var shanglian = makeElement('right');
                    var xialian = makeElement('left');
                    var hengpi = (function () {
                        var div = document.createElement('div');
                        div.setAttribute('class', 'desktop-only chunlian hengpi');
                        div.setAttribute('style', `position: fixed; top: 2vh; width: calc(100vw - 42vh); height: 15.6vh; left: 21vh;`)
                        div.setAttribute('onclick', 'return false');
                        var img = document.createElement('img');
                        img.setAttribute('src', `/JN-Lab/other-images/kotomatsu-chunlian-hengpi.jpg`);
                        img.setAttribute('style', `height: 100%; display: block; margin: 0 auto;`);
                        img.setAttribute('data-rotation', 'X0');
                        img.setAttribute('data-scale', '1.00');
                        img.setAttribute('onclick', 'return false');
                        div.appendChild(img);
                        return div;
                    })();
                    document.body.appendChild(shanglian);
                    document.body.appendChild(xialian);
                    document.body.appendChild(hengpi);

                    var renderElementTransformStyle = function (img) {
                        img.style.transform = [
                            `rotate${img.getAttribute('data-rotation')[0]}(${img.getAttribute('data-rotation').slice(1)}deg)`,
                            `scale(${img.getAttribute('data-scale')})`
                        ].join(' ');
                    };

                    document.querySelectorAll('.chunlian > img').forEach(function (chunlian) {
                        chunlian.addEventListener('mouseover', function (e) {
                            e.target.setAttribute('data-scale', '1.00');
                            renderElementTransformStyle(e.target);
                            document.body.setAttribute('data-chunlian-hover', 'true');
                        });
                        chunlian.addEventListener('mouseleave', function (e) {
                            e.target.setAttribute('data-scale', '1.00');
                            renderElementTransformStyle(e.target);
                            document.body.setAttribute('data-chunlian-hover', 'false');
                        });
                    });

                    document.querySelectorAll('.chunlian.vertical > img').forEach(function (chunlian) {
                        chunlian.addEventListener('click', function (e) {
                            var currentRotation = Number(e.target.getAttribute('data-rotation').slice(1));
                            e.target.setAttribute('data-rotation', 'Y' + (currentRotation + 180));
                            renderElementTransformStyle(e.target);
                        });
                    });
                    document.querySelector('.chunlian.hengpi > img').addEventListener('click', function (e) {
                        var currentRotation = Number(e.target.getAttribute('data-rotation').slice(1));
                        e.target.setAttribute('data-rotation', 'X' + (currentRotation + 180));
                        renderElementTransformStyle(e.target);
                    });

                    document.addEventListener('scroll', function () {
                        if (window.pageYOffset > window.screen.availHeight * 0.8) {
                            document.body.setAttribute('data-should-hide-hengpi', 'true');
                        } else {
                            document.body.setAttribute('data-should-hide-hengpi', 'false');
                        };
                        var opacity = Math.max( 0, (1-(window.pageYOffset/window.screen.availHeight/0.8)) );
                        document.querySelector('.chunlian.hengpi').style.opacity = opacity;
                        renderElementTransformStyle(document.querySelector('.chunlian.hengpi > img'));
                    });
                }
            }
        };

        (function () {
            window.anyThemeApplied = false;
            Object.keys(themes).map(function (themeId) {
                console.log('paths: ' +
                    themes[themeId].paths.map(function (reg) {
                        return (location.pathname).match(reg)
                    }).join()
                );
                console.log('preventedPaths: ' +
                    themes[themeId].preventedPaths.map(function (reg) {
                        return (location.pathname + location.search).match(reg)
                    }).join()
                );
                if (
                    location.href.match(new RegExp('[?&]theme=' + themeId))
                    &&
                    themes[themeId].paths.map(function (reg) {
                        return (location.pathname).match(reg) ? true : false;
                    }).filter(function (x) { return x; }).length !== 0
                    &&
                    themes[themeId].preventedPaths.map(function (reg) {
                        return (location.pathname + location.search).match(reg) ? true : false;
                    }).filter(function (x) { return x; }).length === 0
                    &&
                    !window.anyThemeApplied
                ) {
                    window.anyThemeApplied = themeId;
                    themes[themeId].action();
                }
            });
            Object.keys(themes).map(function (themeId) {
                if (
                    (
                        d.getTime() > (new Date(themes[themeId].dateRange[0] + ' ' + d.getFullYear())).getTime()
                        &&
                        d.getTime() < (new Date(themes[themeId].dateRange[1] + ' ' + d.getFullYear())).getTime()
                    )
                    &&
                    themes[themeId].paths.map(function (reg) {
                        return (location.pathname).match(reg) ? true : false;
                    }).filter(function (x) { return x; }).length !== 0
                    &&
                    themes[themeId].preventedPaths.map(function (reg) {
                        return (location.pathname + location.search).match(reg) ? true : false;
                    }).filter(function (x) { return x; }).length === 0
                    &&
                    !window.anyThemeApplied
                ) {
                    anyThemeApplied = themeId;
                    themes[themeId].action();
                };
            });
            window.setInterval(function () {
                [...document.querySelectorAll('a')].filter(function (a) {
                    return a.href.match('' + location.host) ? true : false;
                }).map(function (a) {
                    if (a.getAttribute('data-theme-link-done') !== 'true' && window.mandatoryTheme) {
                        var qs = !!a.href.match(/\w+=[\w\d]+$/);
                        a.href += (qs ? '&' : '?') + 'theme=' + window.anyThemeApplied;
                        a.setAttribute('data-theme-link-done', 'true');
                    } else if (a.getAttribute('data-theme-link-done') !== 'true' && window.mandatoryDate) {
                        var qs = !!a.href.match(/\w+=[\w\d]+$/);
                        a.href += (qs ? '&' : '?') + 'date=' + window.mandatoryDate;
                        a.setAttribute('data-theme-link-done', 'true');
                    };
                });
            }, 500);
        })();
    })();
});

(function (d) {
    if (
        d.getTime() > (new Date('Jan 15 ' + d.getFullYear())).getTime()
        &&
        d.getTime() < (new Date('Feb 25 ' + d.getFullYear())).getTime()
    ) {
        // Enable Chunjie features
        (function () {
            if (location.pathname !== '/') {
                document.body.setAttribute('data-should-always-hide-hengpi', 'true');
            };

            var linkTag = document.createElement('link');
            linkTag.setAttribute('rel', 'stylesheet');
            linkTag.setAttribute('href', '/css/chunjie.css');
            document.head.appendChild(linkTag);

            var makeElement = function (align) {
                var div = document.createElement('div');
                div.setAttribute('class', 'desktop-only chunlian');
                div.setAttribute('style', `position: fixed; top: 2vh; height: 96vh; ${align}: 2vh;`)
                var img = document.createElement('img');
                img.setAttribute('src', `/JN-Lab/other-images/kotomatsu-chunlian-${align}.png`);
                img.setAttribute('style', `height: 100%; display: block; margin: 0 auto;`);
                div.appendChild(img);
                return div;
            };
            var shanglian = makeElement('right');
            var xialian = makeElement('left');
            var hengpi = (function () {
                var div = document.createElement('div');
                div.setAttribute('class', 'desktop-only chunlian hengpi');
                div.setAttribute('style', `position: fixed; top: 2vh; width: calc(100vw - 42vh); height: 15.473977695vh; left: 21vh;`)
                var img = document.createElement('img');
                img.setAttribute('src', `/JN-Lab/other-images/kotomatsu-chunlian-hengpi.png`);
                img.setAttribute('style', `height: 100%; display: block; margin: 0 auto;`);
                div.appendChild(img);
                return div;
            })();
            document.body.appendChild(shanglian);
            document.body.appendChild(xialian);
            document.body.appendChild(hengpi);

            document.addEventListener('scroll', function () {
                console.log('123');
                if (window.pageYOffset > window.screen.availHeight * 0.8) {
                    document.body.setAttribute('data-should-hide-hengpi', 'true');
                } else {
                    document.body.setAttribute('data-should-hide-hengpi', 'false');
                };
                var opacity = Math.max( 0, (1-(window.pageYOffset/window.screen.availHeight/0.8)) )
                document.querySelector('.chunlian.hengpi').style.opacity = opacity;
            });
        })();
    }
})(new Date());

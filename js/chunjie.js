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

            var renderNodeTransformStyle = function (node) {
                node.style.transform = [
                    `rotate${node.getAttribute('data-rotation')[0]}(${node.getAttribute('data-rotation').slice(1)}deg)`,
                    `scale(${node.getAttribute('data-scale')})`
                ].join(' ');
            };

            document.querySelectorAll('.chunlian > img').forEach(function (chunlian) {
                chunlian.addEventListener('mouseover', function (e) {
                    e.target.setAttribute('data-scale', '1.02');
                    renderNodeTransformStyle(e.target);
                });
                chunlian.addEventListener('mouseleave', function (e) {
                    e.target.setAttribute('data-scale', '1.00');
                    renderNodeTransformStyle(e.target);
                });
            });

            document.querySelectorAll('.chunlian.vertical > img').forEach(function (chunlian) {
                chunlian.addEventListener('click', function (e) {
                    var currentRotation = Number(e.target.getAttribute('data-rotation').slice(1));
                    e.target.setAttribute('data-rotation', 'Y' + (currentRotation + 180));
                    renderNodeTransformStyle(e.target);
                });
            });
            document.querySelector('.chunlian.hengpi > img').addEventListener('click', function (e) {
                var currentRotation = Number(e.target.getAttribute('data-rotation').slice(1));
                e.target.setAttribute('data-rotation', 'X' + (currentRotation + 180));
                renderNodeTransformStyle(e.target);
            });

            document.addEventListener('scroll', function () {
                if (window.pageYOffset > window.screen.availHeight * 0.8) {
                    document.body.setAttribute('data-should-hide-hengpi', 'true');
                } else {
                    document.body.setAttribute('data-should-hide-hengpi', 'false');
                };
                var opacity = Math.max( 0, (1-(window.pageYOffset/window.screen.availHeight/0.8)) );
                document.querySelector('.chunlian.hengpi').style.opacity = opacity;
                renderNodeTransformStyle(document.querySelector('.chunlian.hengpi'));
                renderNodeTransformStyle(document.querySelector('.chunlian.left'));
                renderNodeTransformStyle(document.querySelector('.chunlian.right'));
            });
        })();
    };
})(new Date());

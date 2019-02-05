var currentAvatarIndex = {
    val: 0,
    getNext: function () {
        if (this.val == 17) {
            return 0;
        } else {
            return this.val + 1;
        };
    },
    moveNext: function () {
        this.val = this.val + 1;
        if (this.val == 18) {
            this.val = 0;
        };
    }
};
avatarsAllLoaded = function () {
    if (window.theStyleForNow && window.theStyleForNow === "dark-moon.css") {
        return 0;
    };
    for (var i = 0; i < 18; i++) {
        var myNode = document.createElement('div');
        myNode.setAttribute('data-avatar-index', i);
        myNode.style.backgroundImage = 'url(/kotomatsu/MY.jpg)'.replace(/MY/, i+1);
        document.getElementById('avatar').appendChild(myNode);
    };
    window.setInterval(function () {
        if (document.querySelector('#avatar :hover')) {
            document.querySelectorAll('div[data-avatar-index="' + currentAvatarIndex.val + '"]')[0].style.opacity = '0';
            document.querySelectorAll('div[data-avatar-index="' + currentAvatarIndex.getNext() + '"]')[0].style.opacity = '1';
            document.getElementById('avatar').style.backgroundImage = 'url(/kotomatsu/MY.jpg)'.replace(/MY/, currentAvatarIndex.getNext()+1);
            currentAvatarIndex.moveNext();
        };
    }, 300);
};
var avatarsLoadedCount = 0;
var avatarCache = [];
(function () {
    for (var i = 1; i < 19; i++) {
        var xImg = new Image();
        xImg.src = '/kotomatsu/MY.jpg'.replace(/MY/, i);
        xImg.onload = function () {
            avatarsLoadedCount += 1;
            if (avatarsLoadedCount == 18) {
                avatarsAllLoaded();
            };
        };
    };
})();

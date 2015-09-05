function startBanner() {
    var tl = new TimelineLite();
    var bannerSize = document.getElementById('app').getAttribute('data-size');
    tl.stop();
    tl.add(TweenLite.to('#copy1', 2, {opacity:1, x: '0%', ease: Quint.easeOut}), "+=.3");
    switch (bannerSize) {
        case "size-300x250":

            break;
        case "size-300x600":

            break;
        case "size-336x280":

            break;
        case "size-250x250":

            break;
        case "size-120x600":

            break;
        case "size-160x600":

            break;
        case "size-728x90":

            break;
    }
    tl.play();
}


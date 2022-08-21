var os = (function () {
    var ua = navigator.userAgent,
        isWindowsPhone = /(?:Windows Phone)/.test(ua),
        isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
        isAndroid = /(?:Android)/.test(ua),
        isFireFox = /(?:Firefox)/.test(ua),
        isChrome = /(?:Chrome|CriOS)/.test(ua),
        isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox &&
            /(?:Tablet)/.test(ua)),
        isPhone = /(?:iPhone)/.test(ua) && !isTablet,
        isPc = !isPhone && !isAndroid && !isSymbian;
    if (isAndroid || isPhone || isTablet) {
        return "phone";
    } else {
        return "pc";
    }
})();

function bindLongClick(target, clickFn=(function(){}), longClickFn=(function(){})) {
    var timer = null, longTime = 400;

    var startFn = ev => {
        timer = setTimeout(() => { longClickFn(ev); timer = null }, longTime);
    };
    var moveFn = ev => {
        clearTimeout(timer);
        timer = null;
    };
    var endFn = ev => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
            clickFn(ev);
        }
    };

    if (os=="pc") {
        target.onmousedown = startFn;
        target.onmousemove = moveFn;
        target.onmouseup = endFn;
    } else {
        target.ontouchstart = startFn;
        target.ontouchmove = moveFn;
        target.ontouchend = endFn;
    }
}

export default bindLongClick;
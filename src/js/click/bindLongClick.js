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
        if (os=="pc") {
            target.addEventListener("mousemove",moveFn,{passive: true});
            target.addEventListener("mouseup",endFn);
        } else {
            target.addEventListener("touchmove",moveFn,{passive: true});
            target.addEventListener("touchend",endFn);
        }
    };
    var moveFn = ev => {
        clearTimeout(timer);
        timer = null;
        clearFn();
    };
    var endFn = ev => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
            clickFn(ev);
        }
        clearFn();
    };

    function clearFn() {
        if (os=="pc") {
            target.removeEventListener("mousemove",moveFn,{passive: true});
            target.removeEventListener("mouseup",endFn);
        } else {
            target.removeEventListener("touchmove",moveFn,{passive: true});
            target.removeEventListener("touchend",endFn);
        }
    }

    if (os=="pc") {
        target.onmousedown = startFn;
    } else {
        target.ontouchstart = startFn;
    }
}

export default bindLongClick;
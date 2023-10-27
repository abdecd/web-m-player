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
    const longTime = 400;
    var timer = null;
    var startX = -1, startY = -1; // moved: -1
    var posHandler = new PosHandler(target);

    var startFn = ev => {
        [startX, startY] = posHandler.getPosFromEvent(ev);
        posHandler.addSingleMoveFn(pos => {
            if (startX != pos[0] || startY != pos[1]) {
                startX = -1, startY = -1;
                posHandler.removeMoveFn();
            }
        });
        timer = setTimeout(() => {
            timer = null;
            if (startX == -1 || startY == -1) return;
            posHandler.removeMoveFn();
            longClickFn(ev);
        }, longTime);
    };
    
    var endFn = ev => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
            if (startX == -1 || startY == -1) return;
            posHandler.removeMoveFn();
            clickFn(ev);
        }
    };

    if (os=="pc") {
        target.addEventListener("mousedown",startFn);
        target.addEventListener("mouseup",endFn);
    } else {
        target.addEventListener("touchstart",startFn);
        target.addEventListener("touchend",endFn);
    }
}

class PosHandler {
    constructor(target) {
        this.target = target;
    }
    getPosFromEvent(ev) {
        if (os=="pc") {
            return [ev.clientX, ev.clientY];
        } else {
            return [ev.targetTouches[0].clientX, ev.targetTouches[0].clientY];
        }
    }
    moveFnCb;
    moveFn = ev => {
        this.moveFnCb(this.getPosFromEvent(ev));
    }
    addSingleMoveFn(moveFnCb) {
        this.moveFnCb = moveFnCb;
        if (os=="pc") {
            this.target.addEventListener("mousemove",this.moveFn);
        } else {
            this.target.addEventListener("touchmove",this.moveFn);
        }
    }
    removeMoveFn() {
        if (os=="pc") {
            this.target.removeEventListener("mousemove",this.moveFn);
        } else {
            this.target.removeEventListener("touchmove",this.moveFn);
        }
    }
};

export default bindLongClick;
function bindLongClick(target, clickFn=(function(){}), longClickFn=(function(){})) {
    var timer = null, longTime = 400;
    var pos = []; // for pc chrome: pointermove would be called automatically

    var startFn = ev => {
        timer = setTimeout(() => { longClickFn(ev); timer = null }, longTime);
        target.addEventListener("pointermove",moveFn,{passive: true});
        target.addEventListener("pointerup",endFn);
        pos = [ev.clientX,ev.clientY]; // for pc chrome
    };
    var moveFn = ev => {
        if (pos[0]==ev.clientX && pos[1]==ev.clientY) return; // for pc chrome
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
        target.removeEventListener("pointermove",moveFn,{passive: true});
        target.removeEventListener("pointerup",endFn);
    }

    target.onpointerdown = startFn;
}

export default bindLongClick;
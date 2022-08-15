import musicAjax from "./nativeBridge/musicAjax";
import showTips from "./nativeBridge/showTips";
import WebMusicList from "./WebMusicList";
import webMusicListStorage from "./webMusicListStorage";

var webMusicManager = {
    name: "",
    id: "",
    handler: new Audio(),
    list: null,

    _PUSH_STATE: Object.freeze({SUCCESS: Symbol(), EXISTS: Symbol(), FAILED: Symbol()}),
    get PUSH_STATE() {return this._PUSH_STATE},
    //handler.src受到赋值时会强制转为链接
    get src() {return (this.handler.src==window.location.origin+"/") ? "" : this.handler.src},

    //name, (src or id)
    async load(name,src,id) {
        if (!WebMusicList.isValidItem({name,src,id})) return false;

        this.name = name;
        this.handler.src = src ?? await musicAjax.fetchSrc(id).catch(e => "") ?? "";
        this.id = id ?? "";

        return new Promise((resolve,rej) => {
            var fn, errorFn;
            fn = (function() {
                this.handler.removeEventListener("canplay",fn);
                this.handler.removeEventListener("error",errorFn);
                resolve(true);
            }).bind(this);
            errorFn = (function() {
                this.handler.removeEventListener("canplay",fn);
                this.handler.removeEventListener("error",errorFn);
                rej("error");
            }).bind(this);

            //设置监听
            this.handler.addEventListener("canplay",fn);
            this.handler.addEventListener("error",errorFn);
        });
    },

    async play() {
        try {
            await this.handler.play();
        } catch {
            showTips.info("播放失败。");
            return false;
        }
        return true;
    },
    pause() { this.handler.pause(); },
    async playPause() {
        if (!this.src) return false;
        if (this.handler.paused) {
            return await this.play();
        } else {
            this.pause();
            return false;
        }
    },

    getMaxTime() { return this.handler.duration || 10000000; },
    getCurrentTime() { return this.handler.currentTime; },
    setCurrentTime(time) { if (this.src) this.handler.currentTime = time },

    push(name,src,id) {
        if (!WebMusicList.isValidItem({name,src,id})) return this.PUSH_STATE.FAILED;
        if (this.list.find(elem => WebMusicList.getIdOrSrc(elem)==(id || src))) return this.PUSH_STATE.EXISTS;
        return this.list.push({name,src,id}) ? this.PUSH_STATE.SUCCESS : this.PUSH_STATE.FAILED;
    },
    pop() { return this.list.pop(); },

    //循环播放
    _loopMode: "next",
    _loopFn: null,
    get loopMode() { return this._loopMode },
    set loopMode(newLoopMode) {
        this.handler.removeEventListener("ended",this._loopFn);
        switch(newLoopMode) {
            case "next":
                this._loopMode = "next";
                this._loopFn = (async function() { if (await this.next()) this.play() }).bind(this);
                break;
            case "repeat":
                this._loopMode = "repeat";
                this._loopFn = (function() { this.play() }).bind(this);
                break;
            case "random":
                this._loopMode = "random";
                this._loopFn = (async function() { if (await this.nextRandom()) this.play() }).bind(this);
                break;
        }
        this.handler.addEventListener("ended",this._loopFn);
    },

    async next() {
        var obj = this.list.next();
        if (!obj) return false;
        return await this.load(obj.name, obj.src, obj.id);//todo: 网卡自动重新加载 while(!await this.load(obj.name, obj.src, obj.id).catch(e => false))); return true;
    },
    async before() {
        var obj = this.list.before();
        if (!obj) return false;
        return await this.load(obj.name, obj.src, obj.id);
    },
    async nextRandom() {
        var obj = this.list.nextRandom();
        if (!obj) return false;
        return await this.load(obj.name, obj.src, obj.id);
    },

    async nextByLoopOrder() {
        switch(this._loopMode) {
            case "next":
                return await this.next();
            case "repeat":
                return this.src ? (this.setCurrentTime(0),true) : false;
            case "random":
                return await this.nextRandom();
        }
        return false;
    },
};

if (webMusicListStorage.names.length==0) {
    webMusicManager.list = new WebMusicList(null,null,true);
} else  {
    var name = webMusicListStorage.names[0];
    webMusicManager.list = new WebMusicList(name,webMusicListStorage.get(name),true);
    webMusicManager.next();
}

webMusicManager._loopFn = (async function() { if (await this.next()) this.play() }).bind(webMusicManager);
webMusicManager.handler.addEventListener("ended",webMusicManager._loopFn);

export default webMusicManager;
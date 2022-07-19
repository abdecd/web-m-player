import musicAjax from "./musicAjax";
import showTips from "./showTips";
import WebMusicList from "./WebMusicList";
import WebMusicListStorage from "./WebMusicListStorage";

var WebMusicManager = {
    name: "",
    id: "",
    handler: new Audio(),
    list: null,

    //受到赋值时会强制转为链接
    get src() {return (this.handler.src==window.location.origin+"/") ? "" : this.handler.src},

    //name, (src or id)
    async load(name,src,id) {
        if (!name || (!src && !id)) return false;

        this.name = name;
        this.handler.src = src ?? await musicAjax.fetchSrc(id) ?? "";
        this.id = id ?? "";

        return new Promise(resolve => {
            var fn = (function() {
                this.handler.removeEventListener("canplay",fn);
                resolve(true);
            }).bind(this);

            //设置监听
            this.handler.addEventListener("canplay",fn);
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

    push(name,src,id) { return name && (src || id) && this.list.push({name,src,id}); },
    pop() { return this.list.pop(); },
    getList() { return this.list; },

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
        return await this.load(obj.name, obj.src, obj.id);
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

if (WebMusicListStorage.names.length==0) {
    WebMusicManager.list = new WebMusicList(null,null,true);
} else  {
    var name = WebMusicListStorage.names[0];
    WebMusicManager.list = new WebMusicList(name,WebMusicListStorage.get(name),true);
}

WebMusicManager._loopFn = (async function() { if (await this.next()) this.play() }).bind(WebMusicManager);
WebMusicManager.handler.addEventListener("ended",WebMusicManager._loopFn);

window.WebMusicManager = WebMusicManager;

export default WebMusicManager;
import musicAjax from "./nativeBridge/musicAjax";
import showTips from "./showTips";
import Subscription from "./Subscription";
import WebMusicList from "./WebMusicList";
import webMusicListStorage from "./webMusicListStorage";

var webMusicManager = {
    get name() { return this.musicObj.name || ""; },
    get id() { return this.musicObj.id || ""; },
    //handler.src受到赋值时会强制转为链接
    get src() {return (this.handler.src==window.location.origin+"/") ? "" : this.handler.src},
    musicObj: {},

    handler: new Audio(),
    list: new WebMusicList(),
    aheadList: [],
    previousList: [],

    get PUSH_STATE() {return WebMusicList.PUSH_STATE},

    nameChangeSub: new Subscription(),
    addNameChangeListener(fn) {return this.nameChangeSub.subscribe(fn)},
    removeNameChangeListener(fn) {this.nameChangeSub.unsubscribe(fn)},
    listChangeSub: new Subscription(),//回调无参数
    addListChangeListener(fn) {return this.listChangeSub.subscribe(fn)},
    removeListChangeListener(fn) {this.listChangeSub.unsubscribe(fn)},

    //name, (src or id)
    async load(name,src,id) {
        if (!WebMusicList.isValidItem({name,src,id})) return false;

        this.musicObj = {name,src,id};
        this.nameChangeSub.publish(name);
        this.handler.src = src ?? await musicAjax.fetchSrc(id).catch(e => "") ?? "";

        return new Promise(resolve => {
            var fn, errorFn;
            fn = (function() {
                this.handler.removeEventListener("canplay",fn);
                this.handler.removeEventListener("error",errorFn);
                resolve(true);
            }).bind(this);
            errorFn = (function() {
                this.handler.removeEventListener("canplay",fn);
                this.handler.removeEventListener("error",errorFn);
                resolve(false);
            }).bind(this);

            //设置监听
            this.handler.addEventListener("canplay",fn);
            this.handler.addEventListener("error",errorFn);
        });
    },
    // get _VOLUME_TIME_PER_BLOCK() { return 30; },
    // get _VOLUME_CNT() { return 15; },
    async play() {
        try {
            await this.handler.play();
            // for (let i=0;i<=this._VOLUME_CNT;i++) {
            //     setTimeout(() => this.handler.volume=i/this._VOLUME_CNT,i*this._VOLUME_TIME_PER_BLOCK+20);
            // }
        } catch {
            showTips.info("播放失败。");
            return false;
        }
        return true;
    },
    pause() {
        this.handler.pause();
        // for (let i=0;i<=this._VOLUME_CNT;i++) {
        //     setTimeout(() => this.handler.volume=(this._VOLUME_CNT-i)/this._VOLUME_CNT,i*this._VOLUME_TIME_PER_BLOCK+20);
        // }
        // setTimeout(() => this.handler.pause(),this._VOLUME_CNT*this._VOLUME_TIME_PER_BLOCK+20);
    },
    async playPause() {
        if (!this.name) return showTips.info("未选择歌曲。");
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

    push(name,src,id) { return this.list.push({name,src,id}); },
    pushAll(objArr) { return this.list.pushSomeElem(objArr); },
    pop() { return this.list.pop(); },
    pushAhead(name,src,id) { return this.aheadList.push({name,src,id}); },

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

    async loadMusicObj(obj) {
        if (!obj) return null;
        var loadCnt=0;
        while (++loadCnt<=3 && !await this.load(obj.name, obj.src, obj.id));
        if (loadCnt>3) showTips.info("歌曲加载失败。");
        return loadCnt<=3 ? obj : null;
    },
    async next() {
        var obj = await this.loadMusicObj(this.aheadList.shift() || this.list.next());
        if (obj && !WebMusicList.isEqual(this.previousList.at(-1),obj)) this.previousList.push(obj);
        return !!obj;
    },
    async before() {
        if (this.previousList.length>1) this.previousList.pop();
        var state = !!await this.loadMusicObj(this.previousList.at(-1));
        if (state) this.list.confirmIndex(this.previousList.at(-1));
        return state;
    },
    async nextRandom() {
        var obj = await this.loadMusicObj(this.aheadList.shift() || this.list.nextRandom());
        if (obj && !WebMusicList.isEqual(this.previousList.at(-1),obj)) this.previousList.push(obj);
        return !!obj;
    },
    async nextByObj(needLoadObj) {
        var obj = await this.loadMusicObj(needLoadObj);
        if (obj && !WebMusicList.isEqual(this.previousList.at(-1),obj)) this.previousList.push(obj);
        if (obj) this.list.confirmIndex(needLoadObj);
        return !!obj;
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
webMusicManager.listChangeSub.bindProperty(
    webMusicManager,
    "list",
    () => null
);

if (webMusicListStorage.names.length==0) {
    webMusicManager.list = new WebMusicList(null,null,true);
} else  {
    var name = webMusicListStorage.names[webMusicListStorage.currentNameIndex];
    webMusicManager.list = new WebMusicList(name,webMusicListStorage.get(name),true);
    webMusicManager.next();// load to the MusicBar
}

webMusicManager._loopFn = (async function() { if (await this.next()) this.play() }).bind(webMusicManager);
webMusicManager.handler.addEventListener("ended",webMusicManager._loopFn);

export default webMusicManager;
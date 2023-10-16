import musicAjax from "./nativeBridge/musicAjax";
import showTips from "./showTips";
import Subscription from "./utils/Subscription";
import WebMusicList from "./WebMusicList";
import webMusicListStorage from "./webMusicListStorage";

var webMusicManager = {
    get name() { return this.musicObj.name || ""; },
    get id() { return this.musicObj.id || ""; },
    //handler.src受到赋值时会强制转为链接
    get src() {return (this.handler.src==window.location.origin+"/") ? "" : this.handler.src},
    musicObj: {},

    _volume: 1,
    get volume() { return this._volume; },
    set volume(value) {
        this._volume = value;
        this.handler.volume = value;
    },

    handler: new Audio(),
    list: new WebMusicList(),
    aheadList: [],
    previousList: [],

    get PUSH_STATE() {return WebMusicList.PUSH_STATE},

    musicNameChangeSub: new Subscription(),
    listChangeSub: new Subscription(),//回调无参数

    // {name, (src or id)}
    async loadOrFindUrlToAudio(obj,forceRefreshOnline=false) {
        if (!WebMusicList.isValidItem(obj)) return false;

        this.musicObj = obj;
        this.musicNameChangeSub.publish(this.musicObj.name);
        // 获取链接
        if (!this.musicObj.src || forceRefreshOnline) {
            this.musicObj.src = await musicAjax.fetchSrc(this.musicObj.id).catch(e => "");
        }
        this.handler.src = this.musicObj.src;

        // canplay or err时return
        return new Promise(resolve => {
            var fn, errFn;
            var revoker = () => {
                this.handler.removeEventListener("canplay",fn);
                this.handler.removeEventListener("error",errFn);
            };
            fn = () => {
                revoker();
                resolve(true);
            };
            errFn = () => {
                revoker();
                resolve(false);
            }
            //设置监听
            this.handler.addEventListener("canplay",fn);
            this.handler.addEventListener("error",errFn);
        });
    },
    get VOLUME_TIME_PER_BLOCK() { return 8; },
    get VOLUME_CNT() { return 100; },
    async play() {
        try {
            this.handler.volume = this.volume;
            await this.handler.play();
        } catch {
            showTips.info("播放失败。");
            return false;
        }
        return true;
    },
    _easeOutCirc(t, b, c, d) {
        /*
            t = Time - 表示动画开始以来经过的时间。通常从0开始，通过游戏循环或update函数来缓慢增加。
            b = Beginning value - 动画的起点，默认从0开始。
            c = Change in value - 从起点到终点的差值。
            d = Duration - 完成动画所需的时间
        */
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    pause() {
        // this.handler.pause();
        var totalTime = this.VOLUME_CNT*this.VOLUME_TIME_PER_BLOCK;
        var getCurrTime = (nowCnt,timePerBlock) => nowCnt*timePerBlock;
        for (let i=0;i<=this.VOLUME_CNT;i++) {
            setTimeout(() => {
                this.handler.volume=this._easeOutCirc(
                    getCurrTime(i,this.VOLUME_TIME_PER_BLOCK),
                    this.volume,
                    -this.volume,
                    totalTime
                )
            },getCurrTime(i,this.VOLUME_TIME_PER_BLOCK));
        }
        setTimeout(() => this.handler.pause(),totalTime);
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
        var loadCnt=3;
        if (!await this.loadOrFindUrlToAudio(obj)) {
            while (--loadCnt>0 && !await this.loadOrFindUrlToAudio(obj,true));
        }
        if (loadCnt<=0) showTips.info("歌曲加载失败。");
        return loadCnt>0 ? obj : null;
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

// 载入列表
if (webMusicListStorage.names.length==0) {
    webMusicManager.list = new WebMusicList(null,null,true);
} else  {
    var name = webMusicListStorage.names[webMusicListStorage.currentNameIndex];
    webMusicManager.list = new WebMusicList(name,webMusicListStorage.get(name),true);
    webMusicManager.nextByObj(webMusicManager.list.current());// load to the MusicBar
}

webMusicManager.loopMode = "next";

export default webMusicManager;
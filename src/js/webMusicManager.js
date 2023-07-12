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

    handler: new Audio(),
    list: new WebMusicList(),
    aheadList: [],
    previousList: [],

    get PUSH_STATE() {return WebMusicList.PUSH_STATE},

    musicNameChangeSub: new Subscription(),
    listChangeSub: new Subscription(),//回调无参数

    // {name, (src or id)}
    async load(obj) {
        if (!WebMusicList.isValidItem(obj)) return false;

        this.musicObj = obj;
        this.musicNameChangeSub.publish(this.musicObj.name);
        // 获取链接
        if (!this.musicObj.src) {
            this.musicObj.src = await musicAjax.fetchSrc(this.musicObj.id).catch(e => "");
        }
        this.handler.src = this.musicObj.src;

        return new Promise(resolve => {
            //设置监听
            this.handler.addEventListener("canplay",()=>resolve(true),{once: true});
            this.handler.addEventListener("error",()=>resolve(false),{once: true});// todo
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
        while (++loadCnt<=3 && !await this.load(obj));
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
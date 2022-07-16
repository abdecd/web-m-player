import WebMusicList from "./WebMusicList";

var WebMusicManager = {
    name: "",
    id: "",
    handler: new Audio(),
    list: new WebMusicList(),

    async load(name,id,src) {//id非必须
        if (!src) return false;

        this.name = name;
        this.id = id;
        this.handler.src = src;

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
        if (this.name || await this.nextByLoopOrder()) this.handler.play();
    },
    pause() { this.handler.pause(); },
    playPause() {
        if (this.handler.paused) {
            this.play();
            return true;
        } else {
            this.pause();
            return false;
        }
    },

    getMaxTime() { return this.handler.duration || 10000000; },
    getCurrentTime() { return this.handler.currentTime; },
    setCurrentTime(time) { this.handler.currentTime = time },

    push(name,id,src) { return this.list.push({name,id,src}); },
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
        return await this.load(obj.name, obj.id, obj.src);
    },
    async before() {
        var obj = this.list.before();
        if (!obj) return false;
        return await this.load(obj.name, obj.id, obj.src);
    },
    async nextRandom() {
        var obj = this.list.nextRandom();
        if (!obj) return false;
        return await this.load(obj.name, obj.id, obj.src);
    },

    async nextByLoopOrder() {
        switch(this._loopMode) {
            case "next":
                return await this.next();
            case "repeat":
                return this.name ? (this.setCurrentTime(0),true) : false;
            case "random":
                return await this.nextRandom();
        }
        return false;
    },
};

WebMusicManager._loopFn = (async function() { if (await this.next()) this.play() }).bind(WebMusicManager);
WebMusicManager.handler.addEventListener("ended",WebMusicManager._loopFn);

export default WebMusicManager;
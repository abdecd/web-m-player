import WebMusicList from "./WebMusicList";

var WebMusicManager = {
    name: "",
    id: "",
    handler: new Audio(),
    list: new WebMusicList(),

    _loopMode: "next",
    _loopFn: async () => (await this.next()) ? this.play() : 1,
    loopMode: {
        get: function() { return _loopMode },
        set: async function(newLoopMode) {
            this.handler.removeEventListener("ended",_loopFn);
            switch(newLoopMode) {
                case "next":
                    _loopFn = async () => (await this.next()) ? this.play() : 1;
                    break;
                case "repeat":
                    _loopFn = () => this.play();
                    break;
                case "random":
                    _loopFn = async () => (await this.nextRandom()) ? this.play() : 1;
                    break;
            }
            this.handler.addEventListener("ended",_loopFn);
        }
    },

    async load(name,id,src) {
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

    play() { this.handler.play(); },
    pause() { this.handler.pause(); },
    playPause() {
        if (this.handler.paused) {
            this.handler.play();
            return true;
        } else {
            this.handler.pause();
            return false;
        }
    },

    getMaxTime() { return this.handler.duration || 10000000; },
    getCurrentTime() { return this.handler.currentTime; },
    setCurrentTime(time) { this.handler.currentTime = time },
    
    push(name,id,src) { this.list.push({name,id,src}); },
    pop() { return this.list.pop(); },
    getList() { return this.list; },

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
};

WebMusicManager.handler.addEventListener("ended",WebMusicManager._loopFn);

export default WebMusicManager;
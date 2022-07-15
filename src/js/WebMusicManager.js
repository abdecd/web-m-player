import WebMusicList from "./WebMusicList";

var WebMusicManager = {
    name: "",
    id: "",
    handler: new Audio(),
    list: new WebMusicList(),

    async load(name,id,src) {
        this.name = name;
        this.id = id;
        this.handler.src = src;

        return new Promise(resolve => {
            var fn = (function() {
                this.handler.removeEventListener("canplay",fn);
                resolve();
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

    next() {
        var obj = this.list.next();
        this.load(obj.name, obj.id, obj.src);
    },
    before() {
        var obj = this.list.before();
        this.load(obj.name, obj.id, obj.src);
    },
    nextRandom() {
        var obj = this.list.nextRandom();
        this.load(obj.name, obj.id, obj.src);
    },
};

export default WebMusicManager;
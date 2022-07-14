import WebMusicList from "./WebMusicList";
import Subscription from "./Subscription";

var WebMusicManager = {
    title: "",
    id: "",
    handler: new Audio(),
    list: new WebMusicList(),

    timeUpdateSubscription: new Subscription(),
    loadStartSubscription: new Subscription(),

    load(title,id,src) {
        this.title = title;
        this.id = id;
        this.handler.src = src;
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
    
    push(title,id,src) { this.list.push({title,id,src}); },
    pop() { return this.list.pop(); },
    getList() { return this.list; },

    next() {
        var obj = this.list.next();
        this.load(...obj);
    },
    before() {
        var obj = this.list.before();
        this.load(...obj);
    },
    nextRandom() {
        var obj = this.list.nextRandom();
        this.load(...obj);
    },

    addTimeUpdateEventListener(fn) { this.timeUpdateSubscription.add(fn); },
    removeTimeUpdateEventListener(fn) { this.timeUpdateSubscription.remove(fn); },
    addLoadStartEventListener(fn) { this.loadStartSubscription.add(fn); },
    removeLoadStartEventListener(fn) { this.loadStartSubscription.remove(fn); },
};

WebMusicManager.handler.ontimeupdate = ev => WebMusicManager.timeUpdateSubscription.publish(ev);
WebMusicManager.handler.onloadstart = ev => WebMusicManager.loadStartSubscription.publish(ev);

export default WebMusicManager;
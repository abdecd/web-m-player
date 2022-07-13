import WebMusicList from "./WebMusicList";
import Subscription from "./Subscription";

var WebMusicManager = {
    title: "",
    handler: new Audio(),
    list: new WebMusicList(),

    timeUpdateSubscription: new Subscription(),
    loadStartSubscription: new Subscription(),

    load(title,src) { this.title = title; this.handler.src = src; },

    play() { this.handler.play(); },
    pause() { this.handler.pause(); },
    playPause() { this.handler.paused ? this.handler.play() : this.handler.pause(); },

    getMaxTime() { return this.handler.duration || 10000000; },
    getCurrentTime() { return this.handler.currentTime; },
    setCurrentTime(time) { this.handler.currentTime = time },
    
    push(title,src) { this.list.push({title,src}); },
    pop() { return this.list.pop(); },
    getList() { return this.list; },

    next() {
        var obj = this.list.next();
        this.title = obj.title;
        this.handler.src = obj.src;
    },
    before() {
        var obj = this.list.before();
        this.title = obj.title;
        this.handler.src = obj.src;
    },
    nextRandom() {
        var obj = this.list.nextRandom();
        this.title = obj.title;
        this.handler.src = obj.src;
    },

    addTimeUpdateEventListener(fn) { this.timeUpdateSubscription.add(fn); },
    removeTimeUpdateEventListener(fn) { this.timeUpdateSubscription.remove(fn); },
    addLoadStartEventListener(fn) { this.loadStartSubscription.add(fn); },
    removeLoadStartEventListener(fn) { this.loadStartSubscription.remove(fn); },
};

WebMusicManager.handler.ontimeupdate = ev => WebMusicManager.timeUpdateSubscription.publish(ev);
WebMusicManager.handler.onloadstart = ev => WebMusicManager.loadStartSubscription.publish(ev);

export default WebMusicManager;
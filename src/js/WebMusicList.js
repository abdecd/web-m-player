import showTips from './showTips';
import Subscription from './Subscription'
import WebMusicListStorage from './WebMusicListStorage';

class WebMusicList extends Array {
    //[{name,src,id},...] id or src
    index = -1;
    name = null;
    storage = false;
    changeSub = new Subscription();

    constructor(name="defaultList",arr=null,storage=false) {
        super();
        this.name = name || "defaultList";
        this.storage = storage;
        if (arr) for (let i=0,L=arr.length;i<L;i++) this[i]=arr[i];
        if (this.storage) WebMusicListStorage.set(this.name,this);
    }
    
    next() { return this.length==0 ? null : this[this.index = (this.index>=this.length-1 ? 0 : this.index+1)]; }
    before() { return this.length==0 ? null : this[this.index = (this.index<=0 ? (this.length-1) : this.index-1)]; }
    nextRandom() {
        if (this.length==0) return null;
        //create new list
        if (!this.randomList || this.randomList.length==0) {
            this.randomList = new Array(this.length);
            for (let i=0;i<this.length;i++) this.randomList[i]=i;
        }
        
        //get an element from randomList, delete and return it
        return this[this.index = this.randomList.splice(Math.floor(Math.random()*this.randomList.length),1)[0]];
    }

    search(idOrSrc) {
        for (let i=0,L=this.length;i<L;i++) {
            if (WebMusicList.getIdOrSrc(this[i])==idOrSrc) return i;
        }
        return -1;
    }
    static getIdOrSrc(elem) {
        return elem.id || elem.src;
    }

    push(obj) {
        if (!obj.src && !obj.id) return false;

        if (this.find(elem => WebMusicList.getIdOrSrc(elem)==WebMusicList.getIdOrSrc(obj))) {
            var oldIndex = this.search(WebMusicList.getIdOrSrc(obj)), newIndex = this.length-1;
            var swap = this[newIndex];
            this[newIndex] = this[oldIndex];
            this[oldIndex] = swap;
            showTips.info("项目存在，已移至列表末。");
        } else {
            super.push(obj);
        }

        this.randomList = null;
        this.changeSub.publish(new WebMusicList(this.name,this,false));
        if (this.storage) WebMusicListStorage.set(this.name,this);
        return true;
    }
    pop() {
        this.randomList = null;
        this.changeSub.publish(new WebMusicList(this.name,this,false));
        if (this.storage) WebMusicListStorage.set(this.name,this);
        return super.pop();
    }
    shift(...sth) { throw Error("should not use it."); }
    unshift(...sth) { throw Error("should not use it."); }
    splice(...sth) {
        super.splice(...sth);
        this.randomList = null;
        this.changeSub.publish(new WebMusicList(this.name,this,false));
        if (this.storage) WebMusicListStorage.set(this.name,this);
    }

    subscribe(fn) { this.changeSub.add(fn); }
    unSubscribe(fn) { this.changeSub.remove(fn); }
}

export default WebMusicList;
import Subscription from './Subscription'
import webMusicListStorage from './webMusicListStorage';

class BasicWebMusicList {
    index = -1;
    arr = [];
    randomList = [];

    next() { return this.arr.length==0 ? null : this.arr[this.index = (this.index>=this.arr.length-1 ? 0 : this.index+1)]; }
    before() { return this.arr.length==0 ? null : this.arr[this.index = (this.index<=0 ? (this.arr.length-1) : this.index-1)]; }
    nextRandom() {
        if (this.arr.length==0) return null;
        //create new list
        if (this.randomList.length==0) {
            this.randomList = new Array(this.arr.length);
            for (let i=0;i<this.arr.length;i++) this.randomList[i]=i;
        }
        
        //get an element from randomList, delete and return it
        return this.arr[this.index = this.randomList.splice(Math.floor(Math.random()*this.randomList.length),1)[0]];
    }
}

class WebMusicList extends BasicWebMusicList {
    //[{name,src,id},...] id or src
    //弱检验
    name = null;
    storage = false;
    changeSub = new Subscription();

    get length() { return this.arr.length; }

    constructor(name="defaultList",arr=null,storage=false) {
        super();
        this.name = name || "defaultList";
        this.storage = storage;
        if (arr) for (let i=0,L=arr.length;i<L;i++) if (WebMusicList.isValidItem(arr[i])) this.arr[i]=arr[i];
        if (this.storage) webMusicListStorage.set(this.name,this.arr);
    }

    static isValidItem(obj) { return obj && obj.name && (obj.src || obj.id); }
    static getIdOrSrc(elem) { return elem.id || elem.src; }
    
    push(obj) {
        if (!WebMusicList.isValidItem(obj)) return false;
        this.arr.push(obj);
        this.randomList = null;
        this.changeSub.publish(new WebMusicList(this.name,this.arr,false));
        if (this.storage) webMusicListStorage.set(this.name,this.arr);
        return true;
    }
    pop() {
        var ans = this.arr.pop();
        this.randomList = null;
        this.changeSub.publish(new WebMusicList(this.name,this.arr,false));
        if (this.storage) webMusicListStorage.set(this.name,this.arr);
        return ans;
    }
    splice(deleteIndex,wantDeleteCnt) {
        var deleteCnt = (deleteIndex<=this.index) ?
            Math.min(this.index-deleteIndex+1,wantDeleteCnt)
            : 0;
        this.index-=deleteCnt;
        
        var ans = this.arr.splice(deleteIndex,wantDeleteCnt);
        this.randomList = null;
        this.changeSub.publish(new WebMusicList(this.name,this.arr,false));
        if (this.storage) webMusicListStorage.set(this.name,this.arr);
        return ans;
    }

    search(idOrSrc) {
        for (let i=0,L=this.arr.length;i<L;i++) {
            if (WebMusicList.getIdOrSrc(this.arr[i])==idOrSrc) return i;
        }
        return -1;
    }

    swapToFront(idOrSrc) {
        var oldIndex = 0, newIndex = this.search(idOrSrc);
        if (newIndex==-1) return false;
        
        var swap = this.arr[oldIndex];
        this.arr[oldIndex] = this.arr[newIndex];
        this.arr[newIndex] = swap;

        this.randomList = null;
        this.changeSub.publish(new WebMusicList(this.name,this.arr,false));
        if (this.storage) webMusicListStorage.set(this.name,this.arr);
        return true;
    }

    subscribe(fn) { this.changeSub.add(fn); }
    unSubscribe(fn) { this.changeSub.remove(fn); }
}

export default WebMusicList;
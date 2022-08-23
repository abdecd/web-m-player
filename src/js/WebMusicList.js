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
            for (let i=0;i<this.arr.length;i++) this.randomList[i] = i;
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
    changeSub = new Subscription();// 回调无参数

    addChangeListener(fn) { this.changeSub.add(fn); }
    removeChangeListener(fn) { this.changeSub.remove(fn); }
    get length() { return this.arr.length; }

    constructor(name="defaultList",arr=null,storage=false) {
        super();
        this.name = name || "defaultList";
        this.storage = storage;
        if (arr) for (let i=0,L=arr.length;i<L;i++) if (WebMusicList.isValidItem(arr[i])) this.arr.push(arr[i]);
        if (this.storage) webMusicListStorage.set(this.name,this.arr);
    }

    clone() {
        var obj = new WebMusicList(this.name,this.arr,this.storage);
        obj.index = this.index;
        obj.randomList = [...this.randomList];
        return obj;
    }

    static isValidItem(obj) { return obj && obj.name && (obj.src || obj.id); }
    static getIdOrSrc(elem) { return elem.id || elem.src; }

    setStorage(boolValue) {
        this.storage = boolValue;
        if (this.storage) webMusicListStorage.set(this.name,this.arr);
    }
    
    push(obj,silent=false) {
        if (!WebMusicList.isValidItem(obj)) return false;
        this.arr.push(obj);
        this.randomList = [];
        if (!silent) this.changeSub.publish();
        if (this.storage) webMusicListStorage.set(this.name,this.arr);
        return true;
    }
    pop(silent=false) {
        var ans = this.arr.pop();
        this.randomList = [];
        if (!silent) this.changeSub.publish();
        if (this.storage) webMusicListStorage.set(this.name,this.arr);
        return ans;
    }
    delete(index,silent=false) {
        if (index<0 || index>this.arr.length) return null;
        var ans = this.arr.splice(index,1)[0];
        this.randomList = [];
        if (!silent) this.changeSub.publish();
        if (this.storage) webMusicListStorage.set(this.name,this.arr);
        return ans;
    }
    deleteSomeElem(objArr,silent=false) {
        var isStorage = this.storage;
        this.setStorage(false);

        var ans = [];
        for (var obj of objArr) {
            let temp = this.delete(this.search(WebMusicList.getIdOrSrc(obj)),true);
            if (temp) ans.push(temp);
        }
        this.randomList = [];
        if (!silent) this.changeSub.publish();
        this.setStorage(isStorage);
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

        this.randomList = [];
        this.changeSub.publish();
        if (this.storage) webMusicListStorage.set(this.name,this.arr);
        return true;
    }
}

export default WebMusicList;
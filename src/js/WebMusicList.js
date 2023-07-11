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
    static _PUSH_STATE = Object.freeze({SUCCESS: Symbol(), EXISTS: Symbol(), FAILED: Symbol()});
    static get PUSH_STATE() { return WebMusicList._PUSH_STATE; }

    addChangeListener(fn) { return this.changeSub.subscribe(fn); }//arr内容改变时
    removeChangeListener(fn) { this.changeSub.unsubscribe(fn); }
    
    get length() { return this.arr.length; }

    constructor(name="defaultList",data=null,storage=false) {
        // data: {index, arr}
        super();
        this.name = name || "defaultList";
        this.storage = storage;
        if (data?.index && data.index>=0) this.index = data.index;
        if (data?.arr) for (let i=0,L=data.arr.length;i<L;i++) if (WebMusicList.isValidItem(data.arr[i])) this.arr.push(data.arr[i]);
        if (this.storage) webMusicListStorage.set(this.name,this);
    }

    cloneWithNoStorage() {
        var obj = new WebMusicList(this.name,this,false);
        obj.index = this.index;
        obj.randomList = [...this.randomList];
        return obj;
    }

    static isValidItem(obj) { return obj && obj.name && (obj.src || obj.id); }
    static getIdOrSrc(elem) { return elem.id || elem.src; }
    static isEqual(a,b) {
        if (!a && !b) return true;
        if (!a || !b) return false;
        if (a.name!=b.name) return false;
        if (this.getIdOrSrc(a)!=this.getIdOrSrc(b)) return false;
        return true;
    }

    setStorage(boolValue) {
        this.storage = boolValue;
        if (this.storage) webMusicListStorage.set(this.name,this);
    }

    current() {
        return this.arr?.[this.index];
    }
    next() {
        var obj = super.next();
        if (this.storage) webMusicListStorage.set(this.name,this);
        return obj;
    }
    before() {
        var obj = super.before();
        if (this.storage) webMusicListStorage.set(this.name,this);
        return obj;
    }
    nextRandom() {
        var obj = super.nextRandom();
        if (this.storage) webMusicListStorage.set(this.name,this);
        return obj;
    }
    confirmIndex(obj) {
        var newIndex = this.arr.findIndex(elem => WebMusicList.isEqual(elem,obj));
        if (newIndex!=-1) this.index = newIndex;
        if (this.storage) webMusicListStorage.set(this.name,this);
    }
    
    push(obj,silent=false) {
        if (!WebMusicList.isValidItem(obj)) return WebMusicList.PUSH_STATE.FAILED;
        // real "id or src"
        if (obj.src?.startsWith("http")) obj = { ...obj, src: undefined };
        if (obj.src) obj = { ...obj, id: undefined };
        if (this.arr.find(elem => WebMusicList.getIdOrSrc(elem)==WebMusicList.getIdOrSrc(obj))) return WebMusicList.PUSH_STATE.EXISTS;
        this.arr.push(obj);
        this.randomList = [];
        if (!silent) this.changeSub.publish();
        if (this.storage) webMusicListStorage.set(this.name,this);
        return WebMusicList.PUSH_STATE.SUCCESS;
    }
    pop(silent=false) {
        var ans = this.arr.pop();
        if (this.index==this.arr.length) this.index--;
        this.randomList = [];
        if (!silent) this.changeSub.publish();
        if (this.storage) webMusicListStorage.set(this.name,this);
        return ans;
    }
    delete(index,silent=false) {
        if (index<0 || index>this.arr.length) return null;
        var ans = this.arr.splice(index,1)[0];
        if (index<=this.index) this.index--;
        this.randomList = [];
        if (!silent) this.changeSub.publish();
        if (this.storage) webMusicListStorage.set(this.name,this);
        return ans;
    }
    pushSomeElem(objArr,silent=false) {
        var isStorage = this.storage;
        this.setStorage(false);
        
        var successCnt = 0, existsCnt = 0, failCnt = 0;
        for (var elem of objArr) {
            var statue = this.push(elem, true);
            if (statue==WebMusicList.PUSH_STATE.SUCCESS) {
                successCnt++;
            } else if (statue==WebMusicList.PUSH_STATE.EXISTS) {
                existsCnt++;
            } else if (statue==WebMusicList.PUSH_STATE.FAILED) {
                failCnt++;
            }
        }
        if (!silent) this.changeSub.publish();
        this.setStorage(isStorage);
        return { successCnt, existsCnt, failCnt };
    }
    deleteSomeElem(objArr,silent=false) {
        var isStorage = this.storage;
        this.setStorage(false);

        var ans = [];
        for (var obj of objArr) {
            let temp = this.delete(this.search(WebMusicList.getIdOrSrc(obj)),true);
            if (temp) ans.push(temp);
        }
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

    move(oldIndex,newIndex) {
        if (oldIndex<0 || oldIndex>=this.arr.length) return false;
        if (newIndex<0 || newIndex>=this.arr.length) return false;

        if (newIndex>oldIndex) {
            this.arr.splice(newIndex+1,0,this.arr[oldIndex]);
            this.arr.splice(oldIndex,1);
        } else if (newIndex<oldIndex) {
            this.arr.splice(newIndex,0,this.arr[oldIndex]);
            this.arr.splice(oldIndex+1,1);
        }
        if (oldIndex==this.index) this.index = newIndex;
        else if (oldIndex<this.index && newIndex>=this.index) this.index--;
        else if (oldIndex>this.index && newIndex<=this.index) this.index++;

        this.changeSub.publish();
        if (this.storage) webMusicListStorage.set(this.name,this);
        return true;
    }
}

export default WebMusicList;
import Subscription from './Subscription'

class WebMusicList extends Array {
    //[{name,id,src},...]
    index = -1;
    changeSub = new Subscription();
    
    next() { return this.index==-1 ? null : this[this.index = (this.index==this.length-1 ? 0 : this.index+1)]; }
    before() { return this.index==-1 ? null : this[this.index = (this.index<=0 ? (this.length-1) : this.index-1)]; }
    nextRandom() {
        if (this.index==-1) return null;
        //create new list
        if (!this.randomList || this.randomList.length==0) {
            this.randomList = new Array(this.length);
            for (let i=0;i<this.length;i++) this.randomList[i]=i;
        }
        
        //get an element from randomList, delete and return it
        return this[this.index = this.randomList.splice(Math.random()*this.randomList.length,1)];
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
        if (!this.find(elem => WebMusicList.getIdOrSrc(elem)==WebMusicList.getIdOrSrc(obj))) {
            super.push(obj);
            this.randomList = null;
            this.changeSub.publish(this.slice(0));
        }
    }
    pop() {
        super.pop();
        this.randomList = null;
        this.changeSub.publish(this.slice(0));
    }
    shift(...sth) { return; }
    unshift(...sth) { return; }
    splice(...sth) {
        super.splice(...sth);
        this.randomList = null;
        this.changeSub.publish(this.slice(0));
    }

    subscribe(fn) { this.changeSub.add(fn); }
    unSubscribe(fn) { this.changeSub.remove(fn); }
}

export default WebMusicList;
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
            if (this[i].id==idOrSrc || this[i].src==idOrSrc) return i;
        }
        return -1;
    }

    push(...sth) {
        super.push(...sth);
        this.randomList = null;
        this.changeSub.publish(this);
    }
    pop(...sth) {
        super.pop(...sth);
        this.randomList = null;
        this.changeSub.publish(this);
    }
    shift(...sth) {
        super.shift(...sth);
        this.randomList = null;
        this.changeSub.publish(this);
    }
    unshift(...sth) {
        super.unshift(...sth);
        this.randomList = null;
        this.changeSub.publish(this);
    }
    splice(...sth) {
        super.splice(...sth);
        this.randomList = null;
        this.changeSub.publish(this);
    }

    subscribe(fn) { this.changeSub.add(fn); }
    unSubscribe(fn) { this.changeSub.remove(fn); }
}

export default WebMusicList;
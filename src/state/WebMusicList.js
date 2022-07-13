class WebMusicList extends Array {
    index = -1;
    
    next() { return this[this.index = (this.index==this.length-1 ? 0 : this.index+1)]; }
    before() { return this[this.index = (this.index<=0 ? (this.length-1) : this.index-1)]; }
    nextRandom() {
        //create new list
        if (!this.randomList || this.randomList.length==0) {
            this.randomList = new Array(this.length);
            for (let i=0;i<this.length;i++) this.randomList[i]=i;
        }
        
        //get an element from randomList, delete and return it
        return this[this.index = this.randomList.splice(Math.random()*this.randomList.length,1)];
    }
}

export default WebMusicList;
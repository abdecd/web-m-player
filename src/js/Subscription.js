class Subscription {
    fnList = [];

    subscribe(fn) {
        this.fnList.push(fn);
        return () => this.fnList.splice(this.fnList.indexOf(fn),1);
    }
    unsubscribe(fn) {
        this.fnList.splice(this.fnList.indexOf(fn),1);
    }
    publish(...sth) { this.fnList.forEach(fn => fn(...sth)); }
};

export default Subscription;
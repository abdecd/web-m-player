class Subscription {
    fnList = [];

    add(fn) { this.fnList.push(fn); }
    remove(fn) { this.fnList.splice(this.fnList.indexOf(fn),1); }
    publish(...sth) { this.fnList.forEach(fn => fn(...sth)); }
};

export default Subscription;
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

    bindedPublish = null;
    bindProperty(obj,propertyName,publishFn=(value => value)) {
        var privateName = Symbol(propertyName);
        obj[privateName] = obj[propertyName];
        var instance = this;
        instance.bindedPublish = () => instance.publish(publishFn(obj[privateName]));
        Object.defineProperty(obj,propertyName,{
            get: () => obj[privateName],
            set: value => {
                obj[privateName] = value;
                instance.publish(publishFn(value));
            }
        });
    }
};

export default Subscription;
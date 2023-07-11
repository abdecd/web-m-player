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

    // 将该实例与某个对象的属性关联
    bindProperty(obj,propertyName,changeSetvalueToPublish=(value => value)) {
        var privateName = Symbol(propertyName);
        obj[privateName] = obj[propertyName];
        var instance = this;
        Object.defineProperty(obj,propertyName,{
            get: () => obj[privateName],
            set: value => {
                obj[privateName] = value;
                instance.publish(changeSetvalueToPublish(value));
            }
        });
    }

    // 为特定对象的属性 生成对应的关联实例并写入
    static createSubscriptions(rootObj,propertyNames,changeSetvalueToPublishes) {
        for (let i=0;i<propertyNames.length;i++) {
            var subscribeName = propertyNames[i]+"Subscription";
            if (!rootObj[subscribeName] instanceof Subscription) rootObj[subscribeName] = new Subscription();
            rootObj[subscribeName].bindProperty(rootObj,propertyNames[i],changeSetvalueToPublishes?.[i]);
        }
    }
};

export default Subscription;
import Subscription from "./Subscription";

var webMusicListStorage = {
    names: [],
    currentNameIndex: 0,
    namesChangeSub: new Subscription(),// 回调参数: names

    addNamesChangeListener(fn) { return this.namesChangeSub.subscribe(fn); },//不包括currentNameIndex
    removeNamesChangeListener(fn) { this.namesChangeSub.unsubscribe(fn); },

    init() {
        if (!window.localStorage) return false;
        this.names = JSON.parse(localStorage.getItem("wmlsNames")) || [];
        this.currentNameIndex = localStorage.getItem("wmlsNameIndex") || 0;
        return true;
    },
    get(name) {
        return JSON.parse(localStorage.getItem(`wmls-${name}`));
    },
    set(name,data) {
        // data: {index, arr}
        if (!this.names.includes(name)) {
            this.names.push(name);
            this.changeSub.publish(this.names.slice(0));
            localStorage.setItem("wmlsNames",JSON.stringify(this.names));
        }
        localStorage.setItem(`wmls-${name}`,JSON.stringify({index: data.index, arr: data.arr}));
    },
    remove(name) {
        if (this.names.indexOf(name)==-1) return;
        this.names.splice(this.names.indexOf(name),1);
        this.changeSub.publish(this.names.slice(0));
        localStorage.setItem("wmlsNames",JSON.stringify(this.names));
        localStorage.removeItem(`wmls-${name}`);
    },
    removeAll() {
        for (var name of this.names) localStorage.removeItem(`wmls-${name}`);
        this.names = [];
        localStorage.setItem("wmlsNames",JSON.stringify(this.names));
    },
    loadAll() {
        return this.names.map(name => {
            return {
                name,
                data: JSON.parse(localStorage.getItem(`wmls-${name}`)) || [],
            };
        }) || [];
    },
    swapToFront(itemName) {
        var newNameIndex = this.names.indexOf(itemName), oldNameIndex = 0;
        if (this.names.length<1 || newNameIndex<1) return;

        var oldName = this.names[oldNameIndex];
        this.names[oldNameIndex] = this.names[newNameIndex];
        this.names[newNameIndex] = oldName;

        this.changeSub.publish(this.names.slice(0));
        localStorage.setItem("wmlsNames",JSON.stringify(this.names));
    },
    setCurrentNameIndex(index) {
        if (index<0 || index>=this.names.length) return false;
        this.currentNameIndex = index;
        localStorage.setItem("wmlsNameIndex",index);
        return true;
    }
};
webMusicListStorage.namesChangeSub.bindProperty(
    webMusicListStorage,
    "names",
    names => names.slice(0)
);

webMusicListStorage.init();

export default webMusicListStorage;
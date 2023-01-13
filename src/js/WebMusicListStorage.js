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
            this.names = this.names.concat(name);
            localStorage.setItem("wmlsNames",JSON.stringify(this.names));
        }
        localStorage.setItem(`wmls-${name}`,JSON.stringify({index: data.index, arr: data.arr}));
    },
    remove(name) {
        if (this.names.indexOf(name)==-1) return;
        this.names = this.names.filter(elem => elem!=name);
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
        if (this.names.length<=1) return;
        var newNameIndex = this.names.indexOf(itemName), oldNameIndex = 0;
        if (newNameIndex<1) return;
        
        var newNames = this.names.slice();

        var oldName = newNames[oldNameIndex];
        newNames[oldNameIndex] = newNames[newNameIndex];
        newNames[newNameIndex] = oldName;

        this.names = newNames;
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
    names => names.slice()
);

webMusicListStorage.init();

export default webMusicListStorage;
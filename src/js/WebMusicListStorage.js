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
    move(oldIndex,newIndex) {
        if (oldIndex<0 || oldIndex>=this.names.length) return false;
        if (newIndex<0 || newIndex>=this.names.length) return false;

        var newNames = this.names.slice();
        if (newIndex>oldIndex) {
            newNames.splice(newIndex+1,0,newNames[oldIndex]);
            newNames.splice(oldIndex,1);
        } else if (newIndex<oldIndex) {
            newNames.splice(newIndex,0,newNames[oldIndex]);
            newNames.splice(oldIndex+1,1);
        }
        if (oldIndex==this.currentNameIndex) this.setCurrentNameIndex(newIndex);
        else if (oldIndex<this.currentNameIndex && newIndex>=this.currentNameIndex) this.setCurrentNameIndex(this.currentNameIndex-1);
        else if (oldIndex>this.currentNameIndex && newIndex<=this.currentNameIndex) this.setCurrentNameIndex(this.currentNameIndex+1);

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
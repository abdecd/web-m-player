import Subscription from "./Subscription";

var webMusicListStorage = {
    names: [],
    changeSub: new Subscription(),

    init() {
        if (!window.localStorage) return false;
        this.names = JSON.parse(localStorage.getItem("wmlsNames")) || [];
        this.changeSub.publish(this.names.slice(0));
        return true;
    },
    get(name) {
        return JSON.parse(localStorage.getItem(`wmls-${name}`));
    },
    set(name,data) {
        if (!this.names.includes(name)) {
            this.names.push(name);
            this.changeSub.publish(this.names.slice(0));
            localStorage.setItem("wmlsNames",JSON.stringify(this.names));
        }
        localStorage.setItem(`wmls-${name}`,JSON.stringify(data));
    },
    remove(name) {
        if (this.names.indexOf(name)==-1) return;
        this.names.splice(this.names.indexOf(name),1);
        localStorage.setItem("wmlsNames",JSON.stringify(this.names));
        localStorage.removeItem(`wmls-${name}`);
        this.changeSub.publish(this.names.slice(0));
    },
    removeAll() {
        for (var name of this.names) localStorage.removeItem(`wmls-${name}`);
        this.names = [];
        localStorage.setItem("wmlsNames",JSON.stringify(this.names));
        this.changeSub.publish(this.names.slice(0));
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

    subscribe(fn) { this.changeSub.add(fn); },
    unSubscribe(fn) { this.changeSub.remove(fn); },
};

webMusicListStorage.init();

export default webMusicListStorage;
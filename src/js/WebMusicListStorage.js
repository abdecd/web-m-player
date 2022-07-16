import Subscription from "./Subscription";

var WebMusicListStorage = {
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
        this.changeSub.publish(this.names.slice(0));
        localStorage.setItem("wmlsNames",JSON.stringify(this.names));
        localStorage.removeItem(`wmls-${name}`);
    },
    loadAll() {
        return this.names.map(name => {
            return {
                name,
                data: JSON.parse(localStorage.getItem(`wmls-${name}`)) || [],
            };
        }) || [];
    },

    subscribe(fn) { this.changeSub.add(fn); },
    unSubscribe(fn) { this.changeSub.remove(fn); },
};

WebMusicListStorage.init();

export default WebMusicListStorage;
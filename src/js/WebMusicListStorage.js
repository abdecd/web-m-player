import Subscription from "./utils/Subscription";

var webMusicListStorage = {
    names: [],
    currentNameIndex: 0,

    init() {
        if (!window.localStorage) return false;
        this.names = JSON.parse(localStorage.getItem("wmlsNames")) || [];
        this.currentNameIndex = localStorage.getItem("wmlsNameIndex") || 0;
        return true;
    },
    get(name) {
        return JSON.parse(localStorage.getItem(`wmls-${name}`));
    },
    save(name,data) {
        // data: {index, arr}
        data = {...data};
        data.arr = data.arr.map(musicObj=>{
            var {name,id,src} = musicObj;
            var newOne = {};
            if (name) newOne.name = name;
            if (id) newOne.id = id;
            if (src) newOne.src = src;
            // 不保存临时链接
            if (newOne.src) {
                if (newOne.src.startsWith("http")) delete newOne.src;
            }
            // 不保存本地获取的临时id
            if (newOne.src) delete newOne.id;
            return newOne;
        });
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
    namesMove(oldIndex,newIndex) {
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

Subscription.createSubscriptions(
    webMusicListStorage,
    ["names","currentNameIndex"],
    [
        names => names.slice(),// 回调参数: names
        null
    ]
);

webMusicListStorage.init();

export default webMusicListStorage;
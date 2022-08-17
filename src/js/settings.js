import localforage from "localforage";
import Subscription from "./Subscription";

var settingsStorage = {
    defaultSettings: Object.freeze({
        backgroundType: "basic",
        background: "rgb(218,232,232)"
    }),
    settingList: {},

    get(name) {
        return this.settingList[name];
    },
    set(name,value) {
        this.settingList[name] = value;
        this._saveSettingList();
    },

    getFromDb(name) {
        return localforage.getItem(name);
    },
    setToDb(name,value) {
        return localforage.setItem(name,value);
    },

    _saveSettingList() {
        localStorage.setItem("settingList",JSON.stringify(this.settingList));
    }
};

settingsStorage.settingList = JSON.parse(localStorage.getItem("settingList")) || {...settingsStorage.defaultSettings};

var settings = {
    backgroundSub: new Subscription(),//publish: type, url
    async getBackground() {
        // return: { type, value }
        var type = settingsStorage.get("backgroundType");
        if (type=="basic") {
            return { type, value: settingsStorage.get("background") };
        } else {
            return await settingsStorage.getFromDb("backgroundData");
        }
    },
    async setBackground(type,value) {
        // type: "basic", "image", "video"
        // value: String | Blob
        if (type=="basic") {
            settingsStorage.set("backgroundType",type);

            document.body.style.background = value;
            this.backgroundSub.publish(type,value);

            settingsStorage.set("background",value);
            await settingsStorage.setToDb("backgroundData",null);
        } else if (type=="image" || type=="video") {
            settingsStorage.set("backgroundType",type);

            var url = URL.createObjectURL(value);
            this.backgroundSub.publish(type,url);
            setTimeout(() => URL.revokeObjectURL(url),5000);

            settingsStorage.set("background",null);
            await settingsStorage.setToDb("backgroundData",{type,value});
        }
    }
};

window.settingsStorage = settingsStorage;

async function initSettings() {
    var background = await settings.getBackground();
    if (background.type=="basic") {
        settings.setBackground("basic",settingsStorage.get("background"));
    } else {
        settings.setBackground(background.type,background.value);
    }
}

export {
    settingsStorage,
    initSettings,
    settings as default
};
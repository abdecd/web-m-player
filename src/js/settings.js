import localforage from "localforage";
import Subscription from "./utils/Subscription";

var settingsStorage = {
    defaultSettings: Object.freeze({
        backgroundType: "basic",
        background: "rgb(218,232,232)",
        isDarkMode: false
    }),
    _settingListKey: "settingList",
    settingList: {},

    getSetting(name) {
        return this.settingList[name];
    },
    setSetting(name,value) {
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
        localStorage.setItem(this._settingListKey,JSON.stringify(this.settingList));
    }
};

settingsStorage.settingList = JSON.parse(localStorage.getItem(settingsStorage._settingListKey));
if (!settingsStorage.settingList) {
    settingsStorage.settingList = {...settingsStorage.defaultSettings};
    settingsStorage._saveSettingList();
}

var settings = {
    backgroundSub: new Subscription(),//publish: type, url
    async getBackground() {
        // return: { type, value }
        var type = settingsStorage.getSetting("backgroundType");
        if (type=="basic") {
            return { type, value: settingsStorage.getSetting("background") };
        } else {
            return await settingsStorage.getFromDb("backgroundData");
        }
    },
    async setBackground(type,value) {
        // type: "basic", "image", "video"
        // value: String | Blob
        if (type=="basic") {
            settingsStorage.setSetting("backgroundType",type);

            document.body.style.background = value;
            this.backgroundSub.publish(type,value);

            settingsStorage.setSetting("background",value);
            await settingsStorage.setToDb("backgroundData",null);
        } else if (type=="image" || type=="video") {
            settingsStorage.setSetting("backgroundType",type);

            var url = URL.createObjectURL(value);
            this.backgroundSub.publish(type,url);
            setTimeout(() => URL.revokeObjectURL(url),5000);

            settingsStorage.setSetting("background",null);
            await settingsStorage.setToDb("backgroundData",{type,value});
        }
    }
};

window.settingsStorage = settingsStorage;

async function initSettings() {
    var background = await settings.getBackground();
    if (background.type=="basic") {
        settings.setBackground("basic",settingsStorage.getSetting("background"));
    } else {
        settings.setBackground(background.type,background.value);
    }
}

export {
    settingsStorage,
    initSettings,
    settings as default
};
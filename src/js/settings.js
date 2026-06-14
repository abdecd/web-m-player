import localforage from "localforage";
import Subscription from "./utils/Subscription";

var settingsStorage = {
    defaultSettings: Object.freeze({
        backgroundType: "basic",
        background: "rgba(0,0,0,0)",
        isDarkMode: true,
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
            var bgStr = settingsStorage.getSetting("background");
            if (bgStr) {
                if (window.go && window.go.main && window.go.main.App) {
                    try {
                        var base = await window.go.main.App.GetLocalListAbsolutePath();
                        if (base) {
                            var bgBase = base.replace(/\/file\/?$/, "/bg");
                            var filename = bgStr.substring(bgStr.lastIndexOf('/') + 1);
                            bgStr = bgBase + "/" + filename;
                        }
                    } catch (e) {}
                }
                return { type: type, value: bgStr };
            }
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

            if (typeof value === "string") {
                this.backgroundSub.publish(type,value);
                settingsStorage.setSetting("background",value);
                await settingsStorage.setToDb("backgroundData",null);
            } else {
                var url = URL.createObjectURL(value);
                this.backgroundSub.publish(type,url);
                setTimeout(() => URL.revokeObjectURL(url),5000);

                settingsStorage.setSetting("background",null);
                await settingsStorage.setToDb("backgroundData",{type,value});
            }
        }
    }
};

window.settingsStorage = settingsStorage;

async function initSettings() {
    try {
        var background = await settings.getBackground();
        if (background) {
            if (background.type=="basic") {
                settings.setBackground("basic",settingsStorage.getSetting("background"));
            } else {
                settings.setBackground(background.type,background.value);
            }
        }
    } catch (e) {
        console.error("Failed to initialize settings:", e);
    }
}

export {
    settingsStorage,
    initSettings,
    settings as default
};
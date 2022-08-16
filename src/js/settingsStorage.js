import localforage from "localforage";

var settingsStorage = {
    defaultSettings: Object.freeze({
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
    reset(name) {
        this.settingList[name] = this.defaultSettings[name];
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

async function initSettings() {
    var backgroundBlob = await settingsStorage.getFromDb("backgroundBlob");
    if (backgroundBlob) {
        var url = URL.createObjectURL(backgroundBlob);
        document.body.style.background = `url("${url}") no-repeat center/cover`;
        setTimeout(() => URL.revokeObjectURL(url),1000);
    } else if (settingsStorage.get("background")) {
        document.body.style.background = settingsStorage.get("background");
    }
}

export {
    settingsStorage as default,
    initSettings
};
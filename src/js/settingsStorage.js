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

    _saveSettingList() {
        localStorage.setItem("settingList",JSON.stringify(this.settingList));
    }
};

settingsStorage.settingList = JSON.parse(localStorage.getItem("settingList")) || {...settingsStorage.defaultSettings};

function initSettings() {
    document.body.style.background = settingsStorage.get("background");
}

export {
    settingsStorage as default,
    initSettings
};
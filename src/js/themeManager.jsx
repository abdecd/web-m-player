import { createTheme } from "@mui/material";
import { settingsStorage } from "./settings";
import Subscription from "./Subscription";

const lightTheme = createTheme();
const darkTheme = createTheme({ palette: { mode: 'dark' } });

var themeManager = {
    _themeObj,
    changeSub: new Subscription(),//回调无参数

    getThemeObj() { return this._themeObj; },
    getThemeType() {
        if (this._themeObj==lightTheme) {
            return "light";
        } else if (this._themeObj==darkTheme) {
            return "dark";
        }
        return null;
    },
    setThemeType(type) {
        if (type=="light") {
            this._themeObj = lightTheme;
        } else {
            this._themeObj = darkTheme;
        }
        this.changeSub.publish();
    }
};

themeManager._themeObj = settingsStorage.getSetting("isDarkMode") ? darkTheme : lightTheme;

export default themeManager;
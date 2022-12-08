import { createTheme } from "@mui/material";
import { settingsStorage } from "./settings";
import Subscription from "./Subscription";

const lightTheme = createTheme();
const darkTheme = createTheme({ palette: { mode: 'dark' } });

var theme = {
    value: settingsStorage.get("isDarkMode") ? darkTheme : lightTheme,
    changeSub: new Subscription(),//回调无参数

    getThemeType() {
        if (this.value==lightTheme) {
            return "light";
        } else if (this.value==darkTheme) {
            return "dark";
        }
        return null;
    },
    setThemeType(type) {
        if (type=="light") {
            this.value = lightTheme;
        } else {
            this.value = darkTheme;
        }
        this.changeSub.publish();
    }
};

export default theme;
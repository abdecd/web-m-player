import React, { useCallback, useState } from 'react'
import ListItemText from '@mui/material/ListItemText';

import { settingsStorage } from '../../../js/settings';
import { ListItem, Switch } from '@mui/material';
import themeManager from '../../../js/themeManager';

export default function ThemeSettingItem() {
    const [isDarkMode, setIsDarkMode] = useState(themeManager.getThemeType()=="dark");

    var handleChange = useCallback(checked => {
        if (checked) {
            themeManager.setThemeType("dark");
            setIsDarkMode(true);
            settingsStorage.setSetting("isDarkMode",true);
        } else {
            themeManager.setThemeType("light");
            setIsDarkMode(false);
            settingsStorage.setSetting("isDarkMode",false);
        }
    },[]);

    return <ListItem>
        <ListItemText>夜间字体</ListItemText>
        <Switch
            checked={isDarkMode}
            onChange={ev => handleChange(ev.target.checked)}/>
    </ListItem>
}
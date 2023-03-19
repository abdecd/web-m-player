import React, { useCallback, useState } from 'react'
import ListItemText from '@mui/material/ListItemText';

import { settingsStorage } from '../../../js/settings';
import { ListItem, Switch } from '@mui/material';
import theme from '../../../js/theme';

export default function ThemeSettingItem() {
    const [isDarkMode, setIsDarkMode] = useState(theme.getThemeType()=="dark");

    var handleChange = useCallback(checked => {
        if (checked) {
            theme.setThemeType("dark");
            setIsDarkMode(true);
            settingsStorage.set("isDarkMode",true);
        } else {
            theme.setThemeType("light");
            setIsDarkMode(false);
            settingsStorage.set("isDarkMode",false);
        }
    },[]);

    return <ListItem>
        <ListItemText>夜间字体</ListItemText>
        <Switch
            checked={isDarkMode}
            onChange={ev => handleChange(ev.target.checked)}/>
    </ListItem>
}
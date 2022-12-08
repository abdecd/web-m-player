import React, { useCallback, useEffect, useState } from 'react'
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import settings, { settingsStorage } from '../../js/settings';
import requestPic from '../../js/picRequestor';
import showTips from '../../js/showTips';
import { ListItem, Switch, useTheme } from '@mui/material';
import theme from '../../js/theme';

function BackgroundSettingBlock() {
    const [inputValue, setInputValue] = useState("");

    //订阅背景变化
    useEffect(() => {
        settings.getBackground().then(background => setInputValue(background.type=="basic" ? background.value : "[native resource]"));
        return settings.backgroundSub.subscribe((type,background) => {
            setInputValue(type=="basic" ? background : "[native resource]")
        });
    },[]);

    var setBackgroundAndSave = useCallback(str => {
        settings.setBackground("basic",str);
    },[]);

    var resetBackgroundAndSave = useCallback(() => {
        settings.setBackground("basic",settingsStorage.defaultSettings["background"]);
    },[]);

    var setBackgroundFromFile = useCallback(() => {
    (async () => {
        try {
            var { type, arrayBuffer } = await requestPic();
            if (!type) return;
            type = type.replace(/\/.*/,"");

            settings.setBackground(type,new Blob([arrayBuffer]));
        } catch (e) {
            showTips.info("图片过大，保存失败。");
        }
    })();
    },[]);

    return (
        <div style={{margin: "8px"}}>
            <div style={{display: "flex"}}>
                <TextField
                    style={{flex: "1"}}
                    variant="standard"
                    label="background"
                    value={inputValue}
                    onChange={ev => setInputValue(ev.target.value)}/>
                <Button onClick={() => setBackgroundAndSave(inputValue)}>应用</Button>
                <Button onClick={resetBackgroundAndSave}>重置</Button>
            </div>
            <div style={{display: "flex", justifyContent: "flex-end", alignItems: "center"}}>
                <p style={{width: "30px"}}>or: </p>
                <Button variant='outlined' style={{float: "right"}} onClick={setBackgroundFromFile}>选择本地文件</Button>
            </div>
        </div>
    )
}

function BackgroundSettingItem() {
    const [backgroundSetting, setBackgroundSetting] = useState(false);
    var theme = useTheme();

    return <>
        <ListItemButton onClick={() => setBackgroundSetting(!backgroundSetting)}>
            <ListItemText>背景设置</ListItemText>
            {backgroundSetting ? (
                <svg width="30px" height="30px">
                    <polyline points='10,17 15,13 20,17' fill="rgba(0,0,0,0)" stroke={theme.palette.text.secondary} strokeWidth="2"/>
                </svg>
            ) : (
                <svg width="30px" height="30px">
                    <polyline points='10,13 15,17 20,13' fill="rgba(0,0,0,0)" stroke={theme.palette.text.secondary} strokeWidth="2"/>
                </svg>
            )}
        </ListItemButton>
        <Collapse in={backgroundSetting} timeout="auto" unmountOnExit>
            <BackgroundSettingBlock/>
        </Collapse>
    </>
}

function ThemeSettingItem() {
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

export default function SettingList() {
    return (
        <List>
            <BackgroundSettingItem/>
            <ThemeSettingItem/>
        </List>
    )
}
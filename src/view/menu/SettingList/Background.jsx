import React, { useCallback, useEffect, useState } from 'react'
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import settings, { settingsStorage } from '../../../js/settings';
import requestFile from '../../../js/utils/fileRequestor';
import showTips from '../../../js/showTips';
import { useTheme } from '@mui/material';

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
            var { type, arrayBuffer } = await requestFile();
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

export default function BackgroundSettingItem() {
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
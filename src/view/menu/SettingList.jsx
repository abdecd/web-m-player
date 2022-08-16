import React, { useCallback, useEffect, useState } from 'react'
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import settingsStorage from '../../js/settingsStorage';
import requestPic from '../../js/picRequestor';
import showTips from '../../js/showTips';

function BackgroundSettingBlock() {
    const [inputValue, setInputValue] = useState("");

    //初始化
    useEffect(() => {
        setInputValue(document.body.style.background?.slice(0,500));
    },[]);

    var setBackgroundAndSave = useCallback(str => {
        document.body.style.background = str;
        settingsStorage.set("background",str);
        settingsStorage.setToDb("backgroundBlob",null);
    },[]);

    var resetBackgroundAndSave = useCallback(() => {
        settingsStorage.reset("background");
        document.body.style.background = settingsStorage.get("background");
        setInputValue(settingsStorage.get("background"));
        settingsStorage.setToDb("backgroundBlob",null);
    },[setInputValue]);

    var setBackgroundFromFile = useCallback(() => {
    (async () => {
        try {
            var blob = new Blob([await requestPic()]);            
            var url = URL.createObjectURL(blob);
            var background = `url("${url}") no-repeat center/cover`;
            document.body.style.background = background;
            setTimeout(() => URL.revokeObjectURL(url),1000);

            await settingsStorage.setToDb("backgroundBlob",blob);
        } catch (e) {
            showTips.info("图片过大，保存失败。");
        }
    })();
    },[]);

    return (
        <div>
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

    return <>
        <ListItemButton onClick={() => setBackgroundSetting(!backgroundSetting)}>
            <ListItemText>背景设置</ListItemText>
            {backgroundSetting ? (
                <svg width="30px" height="30px">
                    <polyline points='10,17 15,13 20,17' fill="rgba(0,0,0,0)" stroke="#222222" strokeWidth="2"/>
                </svg>
            ) : (
                <svg width="30px" height="30px">
                    <polyline points='10,13 15,17 20,13' fill="rgba(0,0,0,0)" stroke="#222222" strokeWidth="2"/>
                </svg>
            )}
        </ListItemButton>
        <Collapse in={backgroundSetting} timeout="auto" unmountOnExit>
            <BackgroundSettingBlock/>
        </Collapse>
    </>
}

export default function SettingList() {
    return (
        <List>
            <BackgroundSettingItem/>
        </List>
    )
}
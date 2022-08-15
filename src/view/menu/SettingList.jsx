import React, { useCallback, useEffect, useState } from 'react'
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import settingsStorage from '../../js/settingsStorage';
import requestPic from '../../js/picRequestor';

function BackgroundSettingBlock() {
    const [inputValue, setInputValue] = useState("");

    //初始化
    useEffect(() => {
        setInputValue(document.body.style.background?.slice(0,200));
    },[]);

    var setBackgroundAndSave = useCallback(str => {
        document.body.style.background = str;
        settingsStorage.set("background",str);
    },[]);

    var resetBackgroundAndSave = useCallback(() => {
        settingsStorage.reset("background");
        document.body.style.background = settingsStorage.get("background");
        setInputValue(settingsStorage.get("background"));
    },[setInputValue]);

    var setBackgroundFromFile = useCallback(() => {
        requestPic().then(data => {
            settingsStorage.set("background",`url("${data}") no-repeat center/cover`);
            document.body.style.background = `url("${data}") no-repeat center/cover`;
        });
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
            <Button style={{float: "right"}} onClick={setBackgroundFromFile}>选择本地文件</Button>
        </div>
    )
}

export default function SettingList() {
    const [backgroundSetting, setBackgroundSetting] = useState(false);

    return (
        <List>
            <ListItemButton onClick={() => setBackgroundSetting(!backgroundSetting)}>
                <ListItemText>背景设置</ListItemText>
                {backgroundSetting ? <ExpandLess/> : <ExpandMore/>}
            </ListItemButton>
            <Collapse in={backgroundSetting} timeout="auto" unmountOnExit>
                <BackgroundSettingBlock/>
            </Collapse>
        </List>
    )
}
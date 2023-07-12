import { Button, Collapse, ListItemButton, ListItemText, useTheme } from '@mui/material';
import React, { useCallback, useState } from 'react'
import ListnameListPopup from '../../../component/ListnameListPopup';
import requestFile from '../../../js/utils/fileRequestor';
import showTips from '../../../js/showTips';
import webMusicListStorage from '../../../js/webMusicListStorage';

function CollapseBlock() {
    const [shownExportList, setShownExportList] = useState(false);

    var importList = useCallback(async () => {
        var file = await requestFile();
        var name = file.name.replace(/\.txt$/,"");
        var text = await new Blob([file.arrayBuffer]).text();//todo: 本地列表路径转换

        if (webMusicListStorage.names.includes(name)) name += " I";
        while (webMusicListStorage.names.includes(name)) name += "I";
        webMusicListStorage.set(name,JSON.parse(text));
        showTips.info(`已成功导入"${name}"。`);
    },[]);

    var copyTextToClipboard = useCallback(text => {
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = text;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);
    },[]);
    var exportList = useCallback(async listName => {
        var outStr = JSON.stringify(webMusicListStorage.get(listName));
        copyTextToClipboard(outStr);
        showTips.info("已成功复制到剪贴板。");
    },[copyTextToClipboard]);

    return <div style={{display: "flex", justifyContent: "end"}}>
        <Button variant='outlined' style={{margin: "10px"}} onClick={importList}>导入</Button>
        <Button variant='outlined' style={{margin: "10px"}} onClick={() => setShownExportList(true)}>导出</Button>
        <ListnameListPopup
            shown={shownExportList}
            setShown={setShownExportList}
            titleBlock={<p style={{paddingLeft: "20px"}}>请选择需要导出的列表：</p>}
            onItemClick={exportList}/>
    </div>
}

export default function ImportAndExport() {
    const [openCollapse, setOpenCollapse] = useState(false);
    var theme = useTheme();

    return <>
        <ListItemButton onClick={() => setOpenCollapse(x => !x)}>
            <ListItemText>导入和导出</ListItemText>
            {openCollapse ? (
                <svg width="30px" height="30px">
                    <polyline points='10,17 15,13 20,17' fill="rgba(0,0,0,0)" stroke={theme.palette.text.secondary} strokeWidth="2"/>
                </svg>
            ) : (
                <svg width="30px" height="30px">
                    <polyline points='10,13 15,17 20,13' fill="rgba(0,0,0,0)" stroke={theme.palette.text.secondary} strokeWidth="2"/>
                </svg>
            )}
        </ListItemButton>
        <Collapse in={openCollapse} timeout="auto" unmountOnExit>
            <CollapseBlock/>
        </Collapse>
    </>
}

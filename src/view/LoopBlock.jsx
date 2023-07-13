import React, { useCallback, useEffect, useState } from 'react'
import { Button, Input } from '@mui/material'
import webMusicManager from '../js/webMusicManager'
import webMusicListStorage from '../js/webMusicListStorage'
import WebMusicList from '../js/WebMusicList'
import showTips from '../js/showTips'
import MusicList from './LoopBlock/MusicList'
import ListNameList from './LoopBlock/ListNameList'

var RenameSpecificListBar = React.memo(() => {
    const [specificListTempName, setSpecificListTempName] = useState("");

    //订阅specificList.name
    useEffect(() => {
        var refreshFn = () => setSpecificListTempName(webMusicManager.list.name);
        refreshFn();
        return webMusicManager.listChangeSub.subscribe(refreshFn);
    },[]);

    return (
        <form
            onSubmit={ev => {
                ev.preventDefault();
                if (specificListTempName && !webMusicListStorage.names.includes(specificListTempName)) {
                    webMusicListStorage.remove(webMusicManager.list.name);
                    webMusicManager.list.name = specificListTempName;
                    webMusicListStorage.save(specificListTempName,webMusicManager.list);
                } else if (!specificListTempName) {
                    setSpecificListTempName(webMusicManager.list.name);
                } else {
                    setSpecificListTempName(webMusicManager.list.name);
                    showTips.info("重命名失败，与已有名称重复。");
                }
                ev.target.childNodes[0].querySelector("input").blur();
            }}>
            <Input
                style={{width: "5em"}}
                value={specificListTempName}
                onChange={ev => setSpecificListTempName(ev.target.value)}/>
        </form>
    )
});

var TopBar = React.memo(({managing,setManaging,manageComponent,unManageComponent}) => {
    return (
        <div style={{display: "flex", justifyContent: "space-between", margin: "10px", height: "36px"}}>
            <Button
                variant={managing ? 'contained' : 'outlined'}
                disableElevation disableRipple
                onClick={() => setManaging(!managing)}>
                列表管理
            </Button>

            {managing ? manageComponent : unManageComponent}
        </div>
    )
});

function BasicLoopBlock({style,needRemainSpace=false}) {
    const [managing, setManaging] = useState(false);
    const [musicListLoading, setMusicListLoading] = useState(true);

    var createList = useCallback(() => {
        var name = showTips.prompt("name: ");
        if (!name) return;
        if (webMusicListStorage.names.includes(name)) return showTips.info("已有该名称。");
        new WebMusicList(name,null,true);
        showTips.info("创建播放列表成功。");
    },[]);

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", ...style }}>
            <TopBar
                managing={managing}
                setManaging={setManaging}
                manageComponent={<Button variant='outlined' onClick={createList}>new</Button>}
                unManageComponent={<RenameSpecificListBar/>}/>

            <div style={{ flex: "1 1 0", minHeight: 0 }}>
                {/* 留MusicBar位置 */}
                <MusicList
                    shown={!managing}
                    loading={musicListLoading}
                    setLoading={setMusicListLoading}
                    listStyle={needRemainSpace ? {paddingBottom: 'calc(var(--musicbar-height) + 10px)'} : {}}
                />
                <ListNameList
                    shown={managing}
                    setManaging={setManaging}
                    setMusicListLoading={setMusicListLoading}
                    listStyle={needRemainSpace ? {paddingBottom: 'calc(var(--musicbar-height) + 10px)'} : {}}
                />
            </div>
        </div>
    )
}

function LoopBlock({shown,setShown}) {
    const zIndex = 1;
    var maskStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex
    };

    return (
        <>
            {/* mask */}
            {shown && <div style={maskStyle} onClick={() => setShown(false)}/>}
            
            <div style={{
                backdropFilter: "blur(6px)",
                borderRadius: "10px 10px 0 0",
                transition: "0.3s",
                opacity: (shown ? 1 : 0),
                pointerEvents: (shown ? "inherit" : "none"),
                position: "fixed",
                right: "3vw",
                bottom: (shown ? "60px" : "20px"),
                zIndex
            }}>
                <BasicLoopBlock style={{
                    width: "70vw",
                    height: "68vh",
                    boxShadow: "0px 0px 20px 0px rgba(0,0,0,0.2)",
                    borderRadius: "inherit",
                }}/>
            </div>
        </>
    )
}

export {
    LoopBlock as default,
    BasicLoopBlock
}
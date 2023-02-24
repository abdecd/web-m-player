import React, { useCallback, useEffect, useState } from 'react'
import { Button, Input } from '@mui/material'

import webMusicManager from '../js/webMusicManager'
import webMusicListStorage from '../js/webMusicListStorage'
import WebMusicList from '../js/WebMusicList'
import showTips from '../js/showTips'
import undoFnContainer from '../js/reactHooks/supportUndoMusicList'
import MusicList from './LoopBlock/MusicList'
import ListNameList from './LoopBlock/ListNameList'

var RenameSpecificListBar = React.memo(() => {
    const [specificListTempName, setSpecificListTempName] = useState("");

    //订阅specificList.name
    useEffect(() => {
        var refreshFn = () => setSpecificListTempName(webMusicManager.list.name);
        refreshFn();
        webMusicManager.addListChangeListener(refreshFn);
        return () => webMusicManager.removeListChangeListener(refreshFn);
    },[]);

    return (
        <form
            onSubmit={ev => {
                ev.preventDefault();
                if (specificListTempName && !webMusicListStorage.names.includes(specificListTempName)) {
                    webMusicListStorage.remove(webMusicManager.list.name);
                    webMusicManager.list.name = specificListTempName;
                    webMusicListStorage.set(specificListTempName,webMusicManager.list);
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

var TopBar = React.memo(({manageListState,setManageListState,manageComponent,unManageComponent}) => {
    return (
        <div style={{display: "flex", justifyContent: "space-between", margin: "10px", height: "36px"}}>
            <Button
                variant={manageListState ? 'contained' : 'outlined'}
                disableElevation disableRipple
                onClick={() => setManageListState(!manageListState)}>
                列表管理
            </Button>

            {manageListState ? manageComponent : unManageComponent}
        </div>
    )
});

function BasicLoopBlock({style,needRemainSpace=false}) {
    const [specificList, setSpecificList] = useState([]);
    const [nameList, setNameList] = useState([]);
    const [manageListState, setManageListState] = useState(false);

    //订阅specificList
    useEffect(() => {
        var refreshFn = () => setSpecificList(webMusicManager.list.cloneWithNoStorage().arr.map(elem => ({name: elem.name, key: elem.id||elem.src, /*私货*/id: elem.id, src: elem.src})));
        var listChangeHandler = () => {
            refreshFn();
            webMusicManager.list.addChangeListener(refreshFn);
        };
        listChangeHandler();
        webMusicManager.addListChangeListener(listChangeHandler);
        return () => webMusicManager.removeListChangeListener(listChangeHandler);
    },[]);

    //订阅nameList
    useEffect(() => {
        var refreshFn = names => setNameList(names.map(elem => ({name: elem, key: elem})));
        refreshFn(webMusicListStorage.names);
        webMusicListStorage.addNamesChangeListener(refreshFn);
        return () => webMusicListStorage.removeNamesChangeListener(refreshFn);
    },[]);

    var undoSpecificListFn = undoFnContainer.value;

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
                manageListState={manageListState}
                setManageListState={setManageListState}
                manageComponent={<Button variant='outlined' onClick={createList}>new</Button>}
                unManageComponent={<RenameSpecificListBar/>}/>

            {/* todo */}
            <div style={{ flex: "1 1 0" }}>
                {/* 留MusicBar位置 */}
                <MusicList shown={!manageListState} listData={specificList} undoSpecificListFn={undoSpecificListFn} style={needRemainSpace ? {paddingBottom: '60px'} : {}}/>
                <ListNameList shown={manageListState} listData={nameList} setManageListState={setManageListState} style={needRemainSpace ? {paddingBottom: '60px'} : {}}/>
            </div>
        </div>
    )
}

function LoopBlock({shown,setShown}) {
    return (
        <>
            {/* mask */}
            {shown && <div style={{position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 1}} onClick={() => setShown(false)}></div>}
            
            <div style={{
                backdropFilter: "blur(6px)",
                transition: "0.3s",
                opacity: (shown ? 1 : 0),
                pointerEvents: (shown ? "inherit" : "none"),
                position: "fixed",
                right: "3vw",
                bottom: (shown ? "60px" : "20px"),
                zIndex: 1
            }}>
                <BasicLoopBlock style={{width: "70vw", height: "68vh", boxShadow: "0px 0px 20px 0px rgba(0,0,0,0.2)", borderRadius: "10px 10px 0 0" }}/>
            </div>
        </>
    )
}

export {
    LoopBlock as default,
    BasicLoopBlock
}
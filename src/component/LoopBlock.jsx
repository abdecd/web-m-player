import React, { useCallback, useEffect, useState } from 'react'
import { Button, Input } from '@mui/material'

import BasicList from './BasicList'
import style from '../css/LoopBlock.module.css'
import webMusicManager from '../js/webMusicManager'
import webMusicListStorage from '../js/webMusicListStorage'
import WebMusicList from '../js/WebMusicList'
import showTips from '../js/showTips'
import useUndoableMusicList from '../js/useUndoableMusicList'

function RenameSpecificListBar() {
    const [specificListTempName, setSpecificListTempName] = useState("");

    //订阅specificList
    useEffect(() => {
        var refreshFn = () => setSpecificListTempName(webMusicManager.list.name);
        var topFn = () => {
            refreshFn();
            webMusicManager.list.addChangeListener(refreshFn);
        };
        topFn();
        webMusicManager.addListChangeListener(topFn);
        return () => webMusicManager.removeListChangeListener(topFn);
    },[]);

    return (
        <form
            onSubmit={ev => {
                ev.preventDefault();
                if (specificListTempName) {
                    webMusicListStorage.remove(webMusicManager.list.name);
                    webMusicManager.list.name = specificListTempName;
                    webMusicListStorage.set(specificListTempName,webMusicManager.list);
                } else {
                    setSpecificListTempName(webMusicManager.list.name);
                }
                ev.target.childNodes[0].querySelector("input").blur();
            }}>
            <Input
                style={{width: "5em"}}
                value={specificListTempName}
                onChange={ev => setSpecificListTempName(ev.target.value)}/>
        </form>
    )
}

function TopBar({manageListState,setManageListState,manageComponent,unManageComponent}) {
    return (
        <div style={{display: "flex", justifyContent: "space-between", margin: "10px", height: "40px"}}>
            <Button
                variant={manageListState ? 'contained' : 'outlined'}
                disableElevation disableRipple
                onClick={() => setManageListState(!manageListState)}>
                列表管理
            </Button>

            {manageListState ? manageComponent : unManageComponent}
        </div>
    )
}

function BasicLoopBlock() {
    const [specificList, setSpecificList] = useState(new WebMusicList());
    const [nameList, setNameList] = useState([]);
    const [manageListState, setManageListState] = useState(false);

    //订阅specificList
    useEffect(() => {
        var refreshFn = () => setSpecificList(webMusicManager.list.clone());
        var topFn = () => {
            refreshFn();
            webMusicManager.list.addChangeListener(refreshFn);
        };
        topFn();
        webMusicManager.addListChangeListener(topFn);
        return () => webMusicManager.removeListChangeListener(topFn);
    },[]);

    //订阅nameList
    useEffect(() => {
        var refreshFn = names => setNameList(names);
        refreshFn(webMusicListStorage.names);
        //对后续变化
        webMusicListStorage.addChangeListener(refreshFn);
        return () => webMusicListStorage.removeChangeListener(refreshFn);
    },[]);

    var undoSpecificListFn = useUndoableMusicList();

    var selectAndPlayMusic = useCallback(async (ev,elem) => {
        var index = webMusicManager.list.search(elem.id || elem.src);
        if (index==-1) return showTips.info("歌曲加载失败。");
        webMusicManager.list.index = index;
        webMusicManager.list.before();
        if (!await webMusicManager.next()) return showTips.info("歌曲加载失败。");
        webMusicManager.play();
    },[]);

    var swapMusicToFront = useCallback((ev,elem) => {
        if (webMusicManager.list.swapToFront(elem.id || elem.src)) {
            showTips.info("与首项交换成功。",undoSpecificListFn);
        } else {
            showTips.info("与首项交换失败。");
        }
    },[]);

    var removeMusic = useCallback((ev,elem) => {
        var index = webMusicManager.list.search(elem.id || elem.src);
        if (index==-1) return;
        webMusicManager.list.splice(index,1);
        showTips.info("删除项目成功。",undoSpecificListFn);
    },[]);

    var removeAllMusic = useCallback(() => {
        webMusicManager.list.splice(0,webMusicManager.list.length);
        webMusicManager.list.index = -1;
        showTips.info("播放列表已清空。",undoSpecificListFn);
    },[]);

    var createList = useCallback(() => {
        var name = showTips.prompt("name: ");
        if (!name) return;
        if (webMusicListStorage.names.includes(name)) return showTips.info("已有该名称。");
        new WebMusicList(name,null,true);
        showTips.info("创建播放列表成功。");
    },[]);

    var selectList = useCallback((ev,elem) => {
        webMusicManager.list = new WebMusicList(elem.name,webMusicListStorage.get(elem.name),true);
        webMusicManager.listChangeSub.publish();
        setManageListState(false);
    },[]);

    var swapListToFront = useCallback((ev,elem) => {
        webMusicListStorage.swapToFront(elem.name);
        showTips.info("与首项交换成功。");
    },[]);

    var deleteList = useCallback((ev,elem) => {
        if (!showTips.confirm("该操作不可撤销。是否继续？")) return;
        webMusicListStorage.remove(elem.name);
        if (webMusicManager.list.name==elem.name) {
            if (webMusicListStorage.names.length==0) {
                webMusicManager.list = new WebMusicList(null,null,true);
            } else  {
                var name = webMusicListStorage.names[0];
                webMusicManager.list = new WebMusicList(name,webMusicListStorage.get(name),true);
            }
            webMusicManager.listChangeSub.publish();
        }
        showTips.info("删除列表成功。");
    },[]);

    var deleteAllList = useCallback(() => {
        if (!showTips.confirm("该操作不可撤销。是否继续？")) return;
        webMusicListStorage.removeAll();
        webMusicManager.list = new WebMusicList(null,null,true);
        webMusicManager.listChangeSub.publish();
        showTips.info("所有列表已删除。");
    },[]);

    return (
        <div className={style.BasicLoopBlock}>
            <TopBar
                manageListState={manageListState}
                setManageListState={setManageListState}
                manageComponent={<Button variant='outlined' onClick={createList}>new</Button>}
                unManageComponent={<RenameSpecificListBar/>}/>
            
            {/* TopBar: 40+10+10=60px */}
            <div style={{height: "calc(100% - 60px)"}}>
                <BasicList
                    listData={manageListState ? 
                        nameList.map(elem => {return {name: elem, key: elem}})
                        : specificList.arr.map(elem => {return {name: elem.name, key: elem.id||elem.src, /*私货*/id: elem.id, src: elem.src}})}
                    btnText="del"
                    itemClickFn={manageListState ? selectList : selectAndPlayMusic}
                    itemLongClickFn={manageListState ? swapListToFront : swapMusicToFront}
                    btnClickFn={manageListState ? deleteList : removeMusic}
                    btnLongClickFn={manageListState ? deleteAllList : removeAllMusic}/>
            </div>
        </div>
    )
}

export default function LoopBlock({shown,setShown}) {
    return (
        <>
            {/* mask */}
            {shown && <div style={{position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh"}} onClick={() => setShown(false)}></div>}
            
            <div style={{
                backdropFilter: "blur(6px)",
                transition: "0.3s",
                opacity: (shown ? 1 : 0),
                position: 'fixed',
                right: "3vw",
                bottom: (shown ? "60px" : "20px"),
                pointerEvents: (shown ? "auto" : "none")
            }}>
                <BasicLoopBlock/>
            </div>
        </>
    )
}
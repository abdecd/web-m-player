import React, { useCallback, useEffect, useState } from 'react'
import { Button, Input } from '@mui/material'

import BasicList from './BasicList'
import webMusicManager from '../js/webMusicManager'
import webMusicListStorage from '../js/webMusicListStorage'
import WebMusicList from '../js/WebMusicList'
import showTips from '../js/showTips'
import undoFnContainer from '../js/supportUndoMusicList'
import ListItemFilter from './ListItemFilter'

var basicLoopBlockCss = {
    width: "70vw",
    height: "68vh",
    overflow: "auto",

    boxShadow: "0px 0px 20px 0px rgba(0,0,0,0.2)"
};

function BasicLoopBlock() {
    const [specificList, setSpecificList] = useState([]);
    const [filterList, setFilterList] = useState([]);
    const [nameList, setNameList] = useState([]);
    const [manageListState, setManageListState] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(-1);

    //订阅specificList
    useEffect(() => {
        var refreshFn = () => setSpecificList(webMusicManager.list.cloneWithNoStorage().arr.map(elem => ({name: elem.name, key: elem.id||elem.src, /*私货*/id: elem.id, src: elem.src})));
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
        var refreshFn = names => setNameList(names.map(elem => ({name: elem, key: elem})));
        refreshFn(webMusicListStorage.names);
        //对后续变化
        webMusicListStorage.addChangeListener(refreshFn);
        return () => webMusicListStorage.removeChangeListener(refreshFn);
    },[]);

    //订阅歌曲变化
    useEffect(() => {
        var refreshFn = () => {
            setCurrentIndex(webMusicManager.list.search(webMusicManager.id || webMusicManager.src));
        };
        refreshFn();
        webMusicManager.handler.addEventListener("loadstart",refreshFn);
        return () => webMusicManager.handler.removeEventListener("loadStart",refreshFn);
    },[setCurrentIndex]);

    var undoSpecificListFn = undoFnContainer.value;

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
        webMusicManager.list.delete(index);
        showTips.info("项目删除成功。",undoSpecificListFn);
    },[]);

    var removeAllMusic = useCallback(() => {
        var len = webMusicManager.list.deleteSomeElem(filterList).length;

        webMusicManager.list.index = webMusicManager.list.search(webMusicManager.id || webMusicManager.handler.src);
        showTips.info(`已成功删除${len}项。`,undoSpecificListFn);
    },[filterList]);

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
        <div style={basicLoopBlockCss}>
            {/* TopBar: 40+10+10=60px */}
            <TopBar
                manageListState={manageListState}
                setManageListState={setManageListState}
                manageComponent={<Button variant='outlined' onClick={createList}>new</Button>}
                unManageComponent={<RenameSpecificListBar/>}/>
            {/* ListItemFilter: 1.6em */}
            {!manageListState && <ListItemFilter listData={specificList} setFilterList={setFilterList} inputStyle={{height: "1.6em"}}/>}

            <div style={{height: "calc(100% - 60px - 1.6em)"}}>
                <BasicList
                    listData={manageListState ? nameList : filterList}
                    btnText="del"
                    itemClickFn={manageListState ? selectList : selectAndPlayMusic}
                    itemLongClickFn={manageListState ? swapListToFront : swapMusicToFront}
                    btnClickFn={manageListState ? deleteList : removeMusic}
                    btnLongClickFn={manageListState ? deleteAllList : removeAllMusic}
                    currentIndex={currentIndex}/>
            </div>
        </div>
    )
}

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
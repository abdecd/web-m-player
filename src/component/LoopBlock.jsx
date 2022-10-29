import React, { useCallback, useEffect, useState } from 'react'
import { Button, Input, ListItem } from '@mui/material'

import BasicList from './BasicList'
import webMusicManager from '../js/webMusicManager'
import webMusicListStorage from '../js/webMusicListStorage'
import WebMusicList from '../js/WebMusicList'
import showTips from '../js/showTips'
import undoFnContainer from '../js/supportUndoMusicList'
import ListItemFilter from './ListItemFilter'
import { LeftItem, RightBtn } from './ListButton'

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

    //订阅歌曲变化和filterList变化 改currentIndex
    useEffect(() => {
        var refreshFn = () => setCurrentIndex(filterList.findIndex(elem => WebMusicList.getIdOrSrc(elem)==WebMusicList.getIdOrSrc(webMusicManager)));
        refreshFn();
        webMusicManager.handler.addEventListener("loadstart",refreshFn);
        return () => webMusicManager.handler.removeEventListener("loadStart",refreshFn);
    },[filterList]);

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

    var copyList = useCallback((ev,elem) => {
        new WebMusicList(elem.name+" copy",webMusicListStorage.get(elem.name),true);
        showTips.info("复制成功。");
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
                <BasicList>
                {(manageListState ? nameList : filterList)?.map((elem,index) => (
                    <ListItem key={elem.key}>
                    {manageListState ? (<>
                        <LeftItem
                            name={elem.name}
                            subName={elem.subName}
                            clickFn={ev=>selectList(ev,elem)}
                            longClickFn={ev=>swapListToFront(ev,elem)}/>
                        <RightBtn
                            btnText="cp"
                            clickFn={ev=>copyList(ev,elem)}/>
                        <RightBtn
                            btnText="del"
                            clickFn={ev=>deleteList(ev,elem)}
                            longClickFn={ev=>deleteAllList(ev,elem)}/>
                    </>) : (<>
                        <LeftItem
                            name={elem.name}
                            subName={elem.subName}
                            clickFn={ev=>selectAndPlayMusic(ev,elem)}
                            longClickFn={ev=>swapMusicToFront(ev,elem)}
                            shouldHighLight={!manageListState && index==currentIndex}/>
                        <RightBtn
                            btnText="del"
                            clickFn={ev=>removeMusic(ev,elem)}
                            longClickFn={ev=>removeAllMusic(ev,elem)}/>
                    </>)}
                    </ListItem>
                ))}
                </BasicList>
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
    const [display, setDisplay] = useState(false);
    useEffect(() => { if (shown) setDisplay(true); },[shown]);

    return (
        <>
            {/* mask */}
            {shown && <div style={{position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh"}} onClick={() => { setShown(false); setTimeout(() => setDisplay(false),300); }}></div>}
            
            <div style={{
                backdropFilter: "blur(6px)",
                transition: "0.3s",
                opacity: (shown ? 1 : 0),
                display: (display ? "block" : "none"),
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
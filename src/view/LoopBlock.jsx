import React, { useCallback, useEffect, useState } from 'react'
import { Button, Input, ListItem } from '@mui/material'

import BasicList from '../component/BasicList'
import webMusicManager from '../js/webMusicManager'
import webMusicListStorage from '../js/webMusicListStorage'
import WebMusicList from '../js/WebMusicList'
import showTips from '../js/showTips'
import undoFnContainer from '../js/reactHooks/supportUndoMusicList'
import ListItemFilter from '../component/ListItemFilter'
import { LeftItem, RightBtn } from '../component/ListButton'

function BasicLoopBlock({style}) {
    const [specificList, setSpecificList] = useState([]);
    const [filterList, setFilterList] = useState([]);
    const [nameList, setNameList] = useState([]);
    const [manageListState, setManageListState] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [currentListIndex, setCurrentListIndex] = useState(-1);

    //订阅specificList
    useEffect(() => {
        var refreshFn = () => setSpecificList(webMusicManager.list.cloneWithNoStorage().arr.map(elem => ({name: elem.name, key: elem.id||elem.src, /*私货*/id: elem.id, src: elem.src})));
        refreshFn();
        return webMusicManager.addListChangeListener(() => {
            refreshFn();
            webMusicManager.list.addChangeListener(refreshFn);
        });
    },[]);

    //订阅nameList
    useEffect(() => {
        var refreshFn = names => setNameList(names.map(elem => ({name: elem, key: elem})));
        refreshFn(webMusicListStorage.names);
        return webMusicListStorage.addChangeListener(refreshFn);
    },[]);

    //订阅歌曲变化和filterList变化 改currentIndex
    useEffect(() => {
        var refreshFn = () => setCurrentIndex(filterList.findIndex(elem => WebMusicList.getIdOrSrc(elem)==WebMusicList.getIdOrSrc(webMusicManager)));
        refreshFn();
        webMusicManager.handler.addEventListener("loadstart",refreshFn);
        return () => webMusicManager.handler.removeEventListener("loadStart",refreshFn);
    },[filterList]);

    //订阅list和names的改变 改currentListIndex
    useEffect(() => {
        var refreshFn = () => setCurrentListIndex(webMusicListStorage.names.indexOf(webMusicManager.list?.name));
        refreshFn();
        webMusicManager.addListChangeListener(refreshFn);
        webMusicListStorage.addChangeListener(refreshFn);
        return () => {
            webMusicManager.removeListChangeListener(refreshFn);
            webMusicListStorage.removeChangeListener(refreshFn);
        };
    },[]);

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
        if (webMusicManager.list.swap(0,webMusicManager.list.search(elem.id || elem.src))) {
            showTips.info("与首项交换成功。",undoSpecificListFn);
        } else {
            showTips.info("与首项交换失败。");
        }
    },[]);

    var addAheadMusic = useCallback((ev,elem) => {
        webMusicManager.aheadList.push(elem);
        showTips.info("已加入“即将播放”。",() => webMusicManager.aheadList.pop());
    },[]);

    var mvToIndexNext = useCallback((ev,elem,index) => {
        if (webMusicManager.list.mvToIndexNext(index)) {
            showTips.info("已移动至当前播放位置的下一个。",undoSpecificListFn);
        } else {
            showTips.info("移动失败。");
        }
    })

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
        var newListName=elem.name+" copy";
        if (webMusicListStorage.names.includes(newListName)) newListName+=" I";
        while (webMusicListStorage.names.includes(newListName)) newListName+="I";
        new WebMusicList(newListName,webMusicListStorage.get(elem.name),true);
        showTips.info("复制成功。");
    },[]);

    return (
        <div style={{ overflow: "auto", ...style }}>
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
                            longClickFn={ev=>swapListToFront(ev,elem)}
                            shouldHighLight={index==currentListIndex}/>
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
                            shouldHighLight={index==currentIndex}/>
                        <RightBtn
                            btnText={<svg style={{width: "1.1em",height: "1.1em",flex: "1 0 auto",verticalAlign: "middle",fill: "currentColor",overflow: "hidden"}} viewBox="0 0 1000 1000" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15104"><path d="M362.57 764.226h364.149c28.44 0 51.491-23.051 51.491-51.491v-364.149c0-28.44-23.051-51.491-51.491-51.491s-51.491 23.051-51.491 51.491v239.829l-349.073-349.073c-20.119-20.119-52.711-20.119-72.831 0s-20.119 52.711 0 72.831l349.073 349.073h-239.829c-14.202-0.001-27.093 5.754-36.415 15.076s-15.094 22.195-15.076 36.415c0 28.44 23.051 51.491 51.491 51.491z" p-id="15105"></path></svg>}
                            clickFn={ev=>addAheadMusic(ev,elem)}
                            longClickFn={ev=>mvToIndexNext(ev,elem,index)}/>
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

var RenameSpecificListBar = React.memo(() => {
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
                <BasicLoopBlock style={{width: "70vw", height: "68vh", boxShadow: "0px 0px 20px 0px rgba(0,0,0,0.2)"}}/>
            </div>
        </>
    )
}

export {
    LoopBlock as default,
    BasicLoopBlock
}
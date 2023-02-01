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
import { useRef } from 'react'

function LoopBlockListnameList({shown,listData,currentListIndex,setManageListState,style}) {
    // listData: [{name,subName,...}]
    var selectList = useCallback((ev,elem) => {
        if (webMusicManager.list.name==elem.name) {
            setManageListState(false);
            return;
        }
        webMusicManager.list = new WebMusicList(elem.name,webMusicListStorage.get(elem.name),true);
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
        }
        showTips.info("删除列表成功。");
    },[]);

    var deleteAllList = useCallback(() => {
        if (!showTips.confirm("该操作不可撤销。是否继续？")) return;
        webMusicListStorage.removeAll();
        webMusicManager.list = new WebMusicList(null,null,true);
        showTips.info("所有列表已删除。");
    },[]);

    var copyList = useCallback((ev,elem) => {
        var newListName=elem.name+" copy";
        if (webMusicListStorage.names.includes(newListName)) newListName+=" I";
        while (webMusicListStorage.names.includes(newListName)) newListName+="I";
        new WebMusicList(newListName,webMusicListStorage.get(elem.name),true);
        showTips.info("复制成功。");
    },[]);

    return <BasicList style={{display: shown ? "block" : "none", ...style}}>
        { listData.map((elem,index) => (
            <ListItem key={elem.key}>
                <LeftItem
                    name={elem.name}
                    subName={elem.subName}
                    clickFn={ev=>selectList(ev,elem)}
                    longClickFn={ev=>swapListToFront(ev,elem)}
                    shouldHighLight={index==currentListIndex}/>
                <RightBtn
                    btnText={<svg style={{position: "relative",left:"-4px",width: "1em",height: "1em",verticalAlign: "middle",fill: "currentColor",overflow: "hidden"}} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2679"><path d="M720 192h-544A80.096 80.096 0 0 0 96 272v608C96 924.128 131.904 960 176 960h544c44.128 0 80-35.872 80-80v-608C800 227.904 764.128 192 720 192z m16 688c0 8.8-7.2 16-16 16h-544a16 16 0 0 1-16-16v-608a16 16 0 0 1 16-16h544a16 16 0 0 1 16 16v608z" p-id="2680"></path><path d="M848 64h-544a32 32 0 0 0 0 64h544a16 16 0 0 1 16 16v608a32 32 0 1 0 64 0v-608C928 99.904 892.128 64 848 64z" p-id="2681"></path><path d="M608 360H288a32 32 0 0 0 0 64h320a32 32 0 1 0 0-64zM608 520H288a32 32 0 1 0 0 64h320a32 32 0 1 0 0-64zM480 678.656H288a32 32 0 1 0 0 64h192a32 32 0 1 0 0-64z" p-id="2682"></path></svg>}
                    clickFn={ev=>copyList(ev,elem)}
                    style={{flexBasis: "40px"}}/>
                <RightBtn
                    btnText={<svg style={{position: "relative",left:"-4px",width: "1em",height: "1em",verticalAlign: "middle",fill: "currentColor",overflow: "hidden"}} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2370"><path d="M254.398526 804.702412l-0.030699-4.787026C254.367827 801.546535 254.380106 803.13573 254.398526 804.702412zM614.190939 259.036661c-22.116717 0-40.047088 17.910928-40.047088 40.047088l0.37146 502.160911c0 22.097274 17.930371 40.048111 40.047088 40.048111s40.048111-17.950837 40.048111-40.048111l-0.350994-502.160911C654.259516 276.948613 636.328122 259.036661 614.190939 259.036661zM893.234259 140.105968l-318.891887 0.148379-0.178055-41.407062c0-22.13616-17.933441-40.048111-40.067554-40.048111-7.294127 0-14.126742 1.958608-20.017916 5.364171-5.894244-3.405563-12.729929-5.364171-20.031219-5.364171-22.115694 0-40.047088 17.911952-40.047088 40.048111l0.188288 41.463344-230.115981 0.106424c-3.228531-0.839111-6.613628-1.287319-10.104125-1.287319-3.502777 0-6.89913 0.452301-10.136871 1.296529l-73.067132 0.033769c-22.115694 0-40.048111 17.950837-40.048111 40.047088 0 22.13616 17.931395 40.048111 40.048111 40.048111l43.176358-0.020466 0.292666 617.902982 0.059352 0 0 42.551118c0 44.233434 35.862789 80.095199 80.095199 80.095199l40.048111 0 0 0.302899 440.523085-0.25685 0-0.046049 40.048111 0c43.663452 0 79.146595-34.95 80.054267-78.395488l-0.329505-583.369468c0-22.135136-17.930371-40.047088-40.048111-40.047088-22.115694 0-40.047088 17.911952-40.047088 40.047088l0.287549 509.324054c-1.407046 60.314691-18.594497 71.367421-79.993892 71.367421l41.575908 1.022283-454.442096 0.26606 52.398394-1.288343c-62.715367 0-79.305207-11.522428-80.0645-75.308173l0.493234 76.611865-0.543376 0-0.313132-660.818397 236.82273-0.109494c1.173732 0.103354 2.360767 0.166799 3.561106 0.166799 1.215688 0 2.416026-0.063445 3.604084-0.169869l32.639375-0.01535c1.25355 0.118704 2.521426 0.185218 3.805676 0.185218 1.299599 0 2.582825-0.067538 3.851725-0.188288l354.913289-0.163729c22.115694 0 40.050158-17.911952 40.050158-40.047088C933.283394 158.01792 915.349953 140.105968 893.234259 140.105968zM774.928806 815.294654l0.036839 65.715701-0.459464 0L774.928806 815.294654zM413.953452 259.036661c-22.116717 0-40.048111 17.910928-40.048111 40.047088l0.37146 502.160911c0 22.097274 17.931395 40.048111 40.049135 40.048111 22.115694 0 40.047088-17.950837 40.047088-40.048111l-0.37146-502.160911C454.00054 276.948613 436.069145 259.036661 413.953452 259.036661z" p-id="2371"></path></svg>}
                    clickFn={ev=>deleteList(ev,elem)}
                    longClickFn={ev=>deleteAllList(ev,elem)}
                    style={{flexBasis: "40px"}}/>
            </ListItem>
        ))}
    </BasicList>
}

function LoopBlockMusicList({shown,listData,currentIndex,undoSpecificListFn,style}) {
    // listData: [{name,subName,...}]
    const root = useRef();
    const needScroll = useRef(false);
    useEffect(() => webMusicManager.addListChangeListener(() => { needScroll.current = true; }),[]);
    useEffect(() => {
        if (needScroll.current) {
            needScroll.current = false;
            root.current.scrollTop = 0;
        }
    });

    var selectAndPlayMusic = useCallback(async (ev,elem) => {
        var index = webMusicManager.list.search(elem.id || elem.src);
        if (index==-1) return showTips.info("歌曲加载失败。");
        webMusicManager.list.index = index;
        if (await webMusicManager.nextByObj(webMusicManager.list.arr[index])) webMusicManager.play();
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

    var addAllToAheadList = useCallback(() => {
        var oldList = webMusicManager.aheadList;
        webMusicManager.aheadList = webMusicManager.aheadList.concat(listData);
        showTips.info(listData.length+"项已加入“即将播放”。",() => webMusicManager.aheadList = oldList);
    },[listData]);

    var removeMusic = useCallback((ev,elem) => {
        var index = webMusicManager.list.search(elem.id || elem.src);
        if (index==-1) return;
        webMusicManager.list.delete(index);
        showTips.info("项目删除成功。",undoSpecificListFn);
    },[]);

    var removeAllMusic = useCallback(() => {
        var len = webMusicManager.list.deleteSomeElem(listData).length;

        webMusicManager.list.index = webMusicManager.list.search(webMusicManager.id || webMusicManager.handler.src);
        showTips.info(`已成功删除${len}项。`,undoSpecificListFn);
    },[listData]);

    return <BasicList innerRef={root} style={{display: shown ? "block" : "none", ...style}}>
        { listData.map((elem,index) => (
            <ListItem key={elem.key}>
                <LeftItem
                    name={elem.name}
                    subName={elem.subName}
                    clickFn={ev=>selectAndPlayMusic(ev,elem)}
                    longClickFn={ev=>swapMusicToFront(ev,elem)}
                    shouldHighLight={index==currentIndex}/>
                <RightBtn
                    btnText={<svg style={{position: "relative",left:"-4px",width: "1em",height: "1em",verticalAlign: "middle",fill: "currentColor",overflow: "hidden"}} viewBox="0 0 1000 1000" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15104"><path d="M362.57 764.226h364.149c28.44 0 51.491-23.051 51.491-51.491v-364.149c0-28.44-23.051-51.491-51.491-51.491s-51.491 23.051-51.491 51.491v239.829l-349.073-349.073c-20.119-20.119-52.711-20.119-72.831 0s-20.119 52.711 0 72.831l349.073 349.073h-239.829c-14.202-0.001-27.093 5.754-36.415 15.076s-15.094 22.195-15.076 36.415c0 28.44 23.051 51.491 51.491 51.491z" p-id="15105"></path></svg>}
                    clickFn={ev=>addAheadMusic(ev,elem)}
                    longClickFn={ev=>addAllToAheadList()}
                    style={{flexBasis: "40px"}}/>
                <RightBtn
                    btnText={<svg style={{position: "relative",left:"-4px",width: "1em",height: "1em",verticalAlign: "middle",fill: "currentColor",overflow: "hidden"}} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2370"><path d="M254.398526 804.702412l-0.030699-4.787026C254.367827 801.546535 254.380106 803.13573 254.398526 804.702412zM614.190939 259.036661c-22.116717 0-40.047088 17.910928-40.047088 40.047088l0.37146 502.160911c0 22.097274 17.930371 40.048111 40.047088 40.048111s40.048111-17.950837 40.048111-40.048111l-0.350994-502.160911C654.259516 276.948613 636.328122 259.036661 614.190939 259.036661zM893.234259 140.105968l-318.891887 0.148379-0.178055-41.407062c0-22.13616-17.933441-40.048111-40.067554-40.048111-7.294127 0-14.126742 1.958608-20.017916 5.364171-5.894244-3.405563-12.729929-5.364171-20.031219-5.364171-22.115694 0-40.047088 17.911952-40.047088 40.048111l0.188288 41.463344-230.115981 0.106424c-3.228531-0.839111-6.613628-1.287319-10.104125-1.287319-3.502777 0-6.89913 0.452301-10.136871 1.296529l-73.067132 0.033769c-22.115694 0-40.048111 17.950837-40.048111 40.047088 0 22.13616 17.931395 40.048111 40.048111 40.048111l43.176358-0.020466 0.292666 617.902982 0.059352 0 0 42.551118c0 44.233434 35.862789 80.095199 80.095199 80.095199l40.048111 0 0 0.302899 440.523085-0.25685 0-0.046049 40.048111 0c43.663452 0 79.146595-34.95 80.054267-78.395488l-0.329505-583.369468c0-22.135136-17.930371-40.047088-40.048111-40.047088-22.115694 0-40.047088 17.911952-40.047088 40.047088l0.287549 509.324054c-1.407046 60.314691-18.594497 71.367421-79.993892 71.367421l41.575908 1.022283-454.442096 0.26606 52.398394-1.288343c-62.715367 0-79.305207-11.522428-80.0645-75.308173l0.493234 76.611865-0.543376 0-0.313132-660.818397 236.82273-0.109494c1.173732 0.103354 2.360767 0.166799 3.561106 0.166799 1.215688 0 2.416026-0.063445 3.604084-0.169869l32.639375-0.01535c1.25355 0.118704 2.521426 0.185218 3.805676 0.185218 1.299599 0 2.582825-0.067538 3.851725-0.188288l354.913289-0.163729c22.115694 0 40.050158-17.911952 40.050158-40.047088C933.283394 158.01792 915.349953 140.105968 893.234259 140.105968zM774.928806 815.294654l0.036839 65.715701-0.459464 0L774.928806 815.294654zM413.953452 259.036661c-22.116717 0-40.048111 17.910928-40.048111 40.047088l0.37146 502.160911c0 22.097274 17.931395 40.048111 40.049135 40.048111 22.115694 0 40.047088-17.950837 40.047088-40.048111l-0.37146-502.160911C454.00054 276.948613 436.069145 259.036661 413.953452 259.036661z" p-id="2371"></path></svg>}
                    clickFn={ev=>removeMusic(ev,elem)}
                    longClickFn={ev=>removeAllMusic(ev,elem)}
                    style={{flexBasis: "40px"}}/>
            </ListItem>
        ))}
    </BasicList>
}

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

// 留MusicBar位置
function BasicLoopBlock({style,needRemainSpace=false}) {
    const [specificList, setSpecificList] = useState([]);
    const [filterList, setFilterList] = useState([]);
    const [nameList, setNameList] = useState([]);
    const [manageListState, setManageListState] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [currentListIndex, setCurrentListIndex] = useState(-1);

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

    //订阅歌曲变化和filterList变化 改currentIndex
    useEffect(() => {
        var refreshFn = () => setCurrentIndex(filterList.findIndex(elem => WebMusicList.isEqual(elem,webMusicManager.musicObj)));
        refreshFn();
        webMusicManager.handler.addEventListener("loadstart",refreshFn);
        return () => webMusicManager.handler.removeEventListener("loadStart",refreshFn);
    },[filterList]);

    //订阅list和names的改变 改currentListIndex
    useEffect(() => {
        var refreshFn = () => {
            var index = webMusicListStorage.names.indexOf(webMusicManager.list?.name);
            setCurrentListIndex(index);
            webMusicListStorage.setCurrentNameIndex(index);//todo: 可能有更好的方式
        };
        refreshFn();
        webMusicManager.addListChangeListener(refreshFn);
        webMusicListStorage.addNamesChangeListener(refreshFn);
        return () => {
            webMusicManager.removeListChangeListener(refreshFn);
            webMusicListStorage.removeNamesChangeListener(refreshFn);
        };
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
                <LoopBlockListnameList shown={manageListState} listData={nameList} currentListIndex={currentListIndex} setManageListState={setManageListState} style={needRemainSpace ? {paddingBottom: '60px'} : {}}/>
                <LoopBlockMusicList shown={!manageListState} listData={filterList} currentIndex={currentIndex} undoSpecificListFn={undoSpecificListFn} style={needRemainSpace ? {paddingBottom: '60px'} : {}}/>
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
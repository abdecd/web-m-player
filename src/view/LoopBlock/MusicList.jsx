import BasicList from '../../component/BasicList'
import ListItemFilter from '../../component/ListItemFilter'
import { LeftItem, RightBtn } from '../../component/ListButton'
import { useCallback, useEffect, useRef, useState } from 'react'
import useStateReferrer from '../../js/reactHooks/useStateReferrer'
import { ListItem } from '@mui/material'
import Draggable from '../../js/Draggable'
import WebMusicList from '../../js/WebMusicList'
import webMusicManager from '../../js/webMusicManager'

function MusicList(props) {
    const [isEditing, setIsEditing] = useState(true);
    const [filterList, setFilterList] = useState(props.listData);
    const [currentIndex, setCurrentIndex] = useState(-1);

    //订阅歌曲变化和filterList变化 改currentIndex
    var filterListReferrer = useStateReferrer(filterList);
    useEffect(() => {
        var refreshFn = () => setCurrentIndex(filterListReferrer.current.findIndex(elem => WebMusicList.isEqual(elem,webMusicManager.musicObj)));
        refreshFn();
        webMusicManager.handler.addEventListener("loadstart",refreshFn);
        return () => webMusicManager.handler.removeEventListener("loadStart",refreshFn);
    },[]);
    useEffect(() => { setCurrentIndex(filterListReferrer.current.findIndex(elem => WebMusicList.isEqual(elem,webMusicManager.musicObj))); },[filterList]);

    return (
        <div style={{display: props.shown ? "flex" : "none", flexDirection: "column", height: "100%", ...props.style}}>
            <ListItemFilter listData={props.listData} setFilterList={setFilterList} inputStyle={{height: "1.6em"}} style={{display: isEditing ? "none" : "block"}}/>
            { isEditing
                ? <EditList
                    {...props}
                    style={{ flex: "1 1 0" }}
                    listData={filterList}
                    currentIndex={currentIndex}
                    setIsEditing={setIsEditing}/>
                : <NormalList
                    {...props}
                    style={{ flex: "1 1 0" }}
                    listData={filterList}
                    currentIndex={currentIndex}
                    setIsEditing={setIsEditing}/>
            }
        </div>
    )
}

function NormalList({shown,listData,currentIndex,setIsEditing,undoSpecificListFn,style,innerStyle}) {
    // listData: [{name,subName,...}]
    
    // 列表更换时滚动到顶部
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

    return (
        <BasicList innerRef={root} style={{ ...style, ...innerStyle }}>
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
    )
}

function EditList({shown,listData,currentIndex,setIsEditing,undoSpecificListFn,style,innerStyle}) {
    const root = useRef();

    //添加draggable支持
    useEffect(() => {
        var d = new Draggable({
            wrapper: root.current.children[0],
            view: root.current,
            cb: draggable => {
                var { firstIndex, currentIndex, wrapper, dragElem } = draggable;
                webMusicManager.list.move(firstIndex,currentIndex);//todo
                var beforeIndex = currentIndex+(currentIndex>firstIndex ? 1 : 0);
                wrapper.insertBefore(dragElem,wrapper.children[beforeIndex]);
            }
        });
        return () => d.terminate();
    },[listData]);

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", ...style }}>
            <TopBar/>
            <BasicList innerRef={root} style={{flex: "1 1 0", ...innerStyle}}>
                { listData.map((elem,index) => (
                    <ListItem key={elem.key}>
                        <LeftItem
                            name={elem.name}
                            subName={elem.subName}
                            clickFn={ev=>selectAndPlayMusic(ev,elem)}
                            longClickFn={ev=>swapMusicToFront(ev,elem)}
                            shouldHighLight={index==currentIndex}/>
                        <RightBtn
                            className="holder"
                            disableRipple
                            btnText={<svg style={{position: "relative",left:"-4px",width: "1em",height: "1em",verticalAlign: "middle",fill: "currentColor",overflow: "hidden"}} viewBox="0 0 1000 1000" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15104"><path d="M362.57 764.226h364.149c28.44 0 51.491-23.051 51.491-51.491v-364.149c0-28.44-23.051-51.491-51.491-51.491s-51.491 23.051-51.491 51.491v239.829l-349.073-349.073c-20.119-20.119-52.711-20.119-72.831 0s-20.119 52.711 0 72.831l349.073 349.073h-239.829c-14.202-0.001-27.093 5.754-36.415 15.076s-15.094 22.195-15.076 36.415c0 28.44 23.051 51.491 51.491 51.491z" p-id="15105"></path></svg>}
                            style={{flexBasis: "40px"}}/>
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
        </div>
    )
}

function TopBar() {
    return <div>I am TopBar</div>
}

export default MusicList;
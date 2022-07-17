import React, { useCallback, useEffect, useState } from 'react'
import { Button, Input } from '@mui/material'

import BasicList from './BasicList'
import style from '../css/LoopBlock.module.css'
import WebMusicManager from '../js/WebMusicManager'
import WebMusicListStorage from '../js/WebMusicListStorage'
import WebMusicList from '../js/WebMusicList'
import showTips from '../js/showTips'

function RenameSpecificListBar() {
    const [specificListTempName, setSpecificListTempName] = useState("");

    //订阅specificList
    useEffect(() => {
        var refreshFn = list => setSpecificListTempName(list.name);
        refreshFn(WebMusicManager.list);
        //对后续变化
        WebMusicManager.list.subscribe(refreshFn);
        return () => WebMusicManager.list.unSubscribe(refreshFn);
    },[WebMusicManager.list]);

    return <Input
        sx={{width: "22vw"}}
        value={specificListTempName}
        onChange={ev => setSpecificListTempName(ev.target.value)}
        onKeyUp={ev => {
            if (ev.key=="Enter") {
                if (ev.target.value) {
                    WebMusicListStorage.remove(WebMusicManager.list.name);
                    WebMusicManager.list.name = ev.target.value;
                    WebMusicListStorage.set(ev.target.value,WebMusicManager.list);
                } else {
                    setSpecificListTempName(WebMusicManager.list.name);
                }
            }
        }}/>
}

export default function LoopBlock() {
    const [specificList, setSpecificList] = useState(new WebMusicList());
    const [nameList, setNameList] = useState([]);
    const [manageList, setManageList] = useState(false);

    //订阅specificList
    useEffect(() => {
        var refreshFn = list => setSpecificList(list);
        refreshFn(WebMusicManager.list);
        //对后续变化
        WebMusicManager.list.subscribe(refreshFn);
        return () => WebMusicManager.list.unSubscribe(refreshFn);
    },[WebMusicManager.list]);

    //订阅nameList
    useEffect(() => {
        var refreshFn = names => setNameList(names);
        refreshFn(WebMusicListStorage.names);
        //对后续变化
        WebMusicListStorage.subscribe(refreshFn);
        return () => WebMusicListStorage.unSubscribe(refreshFn);
    },[]);

    var playMusic = useCallback(async (ev,elem) => {
        var index = WebMusicManager.list.search(elem.id || elem.src);
        if (index==-1) return showTips.info("载入失败");
        WebMusicManager.list.index = index;
        WebMusicManager.list.before();
        if (!await WebMusicManager.next()) return showTips.info("载入失败");
        WebMusicManager.play();
    },[]);

    var removeMusic = useCallback((ev,elem) => {
        var index = WebMusicManager.list.search(elem.id || elem.src);
        if (index==-1) return;
        WebMusicManager.list.splice(index,1);
    },[]);

    var removeAllMusic = useCallback(() => {
        WebMusicManager.list.splice(0,WebMusicManager.list.length);
    },[]);

    var createList = useCallback(() => {
        var name = showTips.prompt("name: ");
        if (!name) return;
        if (WebMusicListStorage.names.includes(name)) return showTips.info("已有该名称。");
        new WebMusicList(name,null,true);
    },[]);

    var selectList = useCallback((ev,elem) => {
        WebMusicManager.list = new WebMusicList(elem.name,WebMusicListStorage.get(elem.name),true);
        setManageList(false);
    },[]);

    var deleteList = useCallback((ev,elem) => {
        WebMusicListStorage.remove(elem.name);
        if (WebMusicManager.list.name==elem.name) {
            if (WebMusicListStorage.names.length==0) {
                WebMusicManager.list = new WebMusicList(null,null,true);
            } else  {
                var name = WebMusicListStorage.names[0];
                WebMusicManager.list = new WebMusicList(name,WebMusicListStorage.get(name),true);
            }
        }
    },[]);

    var deleteAllList = useCallback(() => {
        for (var n of WebMusicListStorage.names) WebMusicListStorage.remove(n);
        WebMusicManager.list = new WebMusicList(null,null,true);
        showTips.info("播放列表已清空。");
    },[]);

    return (
        <div className={style.LoopBlock}>
            <div style={{display: "flex", justifyContent: "space-between", margin: "10px"}}>
                <Button
                    variant={manageList ? 'contained' : 'outlined'}
                    disableElevation disableRipple
                    onClick={() => setManageList(!manageList)}>
                    列表管理
                </Button>

                {manageList ? (
                    <Button variant='outlined' onClick={createList}>new</Button>
                ) : (
                    <RenameSpecificListBar/>
                )}
            </div>
            
            <BasicList
                listData={manageList ? 
                    nameList.map(elem => {return {name: elem, id: elem}})
                    : specificList.map(elem => {return {name: elem.name, id: elem.id||elem.src, /*私货*/src: elem.src}})}
                btnText="del"
                itemClickFn={manageList ? selectList : playMusic}
                btnClickFn={manageList ? deleteList : removeMusic}
                btnLongClickFn={manageList ? deleteAllList : removeAllMusic}/>
        </div>
    )
}

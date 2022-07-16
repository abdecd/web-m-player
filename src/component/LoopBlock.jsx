import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button } from '@mui/material'

import BasicList from './LoopBlock/BasicList'
import style from '../css/LoopBlock.module.css'
import WebMusicManager from '../js/WebMusicManager'
import WebMusicListStorage from '../js/WebMusicListStorage'
import WebMusicList from '../js/WebMusicList'

export default function LoopBlock() {
    const [specificList, setSpecificList] = useState(new WebMusicList());
    const [nameList, setNameList] = useState([]);
    const [manageList, setManageList] = useState(false);

    //订阅specificList
    useEffect(() => {
        setSpecificList(WebMusicManager.list);

        var refreshFn = list => {
            setSpecificList(list);
            WebMusicListStorage.set(list.name,list);
        };
        WebMusicManager.list.subscribe(refreshFn);
        // return () => WebMusicManager.list.unSubscribe(refreshFn);
    },[WebMusicManager.list]);

    //订阅nameList
    useEffect(() => {
        setNameList(WebMusicListStorage.names.map(elem => {return {name: elem, id: elem}}));
        var refreshFn = names => setNameList(names.map(elem => {return {name: elem, id: elem}}));
        WebMusicListStorage.subscribe(refreshFn);
        return () => WebMusicListStorage.unSubscribe(refreshFn);
    },[]);

    var playMusic = useCallback(async elem => {
        if (await WebMusicManager.load(elem.name,elem.id,elem.src)) {
            WebMusicManager.play();
        } else {
            console.info("载入失败，可能为付费歌曲。");
        }
    },[]);

    var removeMusic = useCallback(elem => {
        var index = WebMusicManager.list.search(elem.id || elem.src);
        if (index==-1) return;
        WebMusicManager.list.splice(index,1);
    },[]);

    var createList = useCallback(() => {
        var name = prompt("name");
        if (!name) return;
        if (WebMusicListStorage.names.includes(name)) {
            alert("已有该名称。");
            return;
        }
        var newList = new WebMusicList(name);
        WebMusicListStorage.set(name,newList);
    },[]);

    var selectList = useCallback(elem => {
        var newList = new WebMusicList(elem.name,WebMusicListStorage.get(elem.name));
        WebMusicManager.list = newList;
    },[]);

    var deleteList = useCallback(elem => {
        WebMusicListStorage.remove(elem.name);
        if (specificList.name==elem.name) {
            if (WebMusicListStorage.names.length==0) {
                var newList = new WebMusicList("defaultList");
                WebMusicManager.list = newList;
                WebMusicListStorage.set(newList.name,newList);
            } else  {
                var name = WebMusicListStorage.names[0];
                WebMusicManager.list = new WebMusicList(name,WebMusicListStorage.get(name));
            }
        }
    },[]);

    return (
        <div className={style.LoopBlock}>
            <Box style={{textAlign: "start"}}>
                <Button variant='outlined' onClick={() => setManageList(!manageList)}>列表管理</Button>
                {manageList && <Button variant='outlined' onClick={createList}>new</Button>}
            </Box>
            
            <BasicList
                listData={manageList ? nameList : specificList}
                btnText="del"
                itemClickFn={manageList ? selectList : playMusic}
                btnClickFn={manageList ? deleteList : removeMusic}/>
        </div>
    )
}

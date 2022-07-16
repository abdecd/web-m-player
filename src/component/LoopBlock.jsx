import React, { useCallback, useEffect, useState } from 'react'
import { Button, Input } from '@mui/material'

import BasicList from './BasicList'
import style from '../css/LoopBlock.module.css'
import WebMusicManager from '../js/WebMusicManager'
import WebMusicListStorage from '../js/WebMusicListStorage'
import WebMusicList from '../js/WebMusicList'

export default function LoopBlock() {
    const [specificList, setSpecificList] = useState(new WebMusicList());
    const [nameList, setNameList] = useState([]);
    const [manageList, setManageList] = useState(false);
    const [specificListTempName, setSpecificListTempName] = useState("");

    //订阅specificList
    useEffect(() => {
        var refreshFn = list => {
            setSpecificList(list);
            setSpecificListTempName(list.name);
        };
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

    var playMusic = useCallback(async elem => {
        if (await WebMusicManager.load(elem.name,elem.id,elem.src)) {
            WebMusicManager.play();
        } else {
            console.info("载入失败");
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
            console.info("已有该名称。");
            return;
        }
        new WebMusicList(name,null,true);
    },[]);

    var selectList = useCallback(elem => {
        WebMusicManager.list = new WebMusicList(elem.name,WebMusicListStorage.get(elem.name),true);
        setManageList(false);
    },[]);

    var deleteList = useCallback(elem => {
        WebMusicListStorage.remove(elem.name);
        if (specificList.name==elem.name) {
            if (WebMusicListStorage.names.length==0) {
                WebMusicManager.list = new WebMusicList("defaultList",null,true);
            } else  {
                var name = WebMusicListStorage.names[0];
                WebMusicManager.list = new WebMusicList(name,WebMusicListStorage.get(name),true);
            }
        }
    },[specificList]);

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
                    <Input
                        sx={{width: "20vw"}}
                        value={specificListTempName}
                        onChange={ev => setSpecificListTempName(ev.target.value)}
                        onKeyUp={ev => {
                            if (ev.key=="Enter") {
                                if (ev.target.value) {
                                    WebMusicListStorage.remove(specificList.name);
                                    WebMusicManager.list.name = ev.target.value;
                                    WebMusicListStorage.set(ev.target.value,specificList);
                                } else {
                                    setSpecificListTempName(specificList.name);
                                }
                            }
                        }}/>
                )}
            </div>
            
            <BasicList
                listData={manageList ? nameList.map(elem => {return {name: elem, id: elem}}) : specificList.map(elem => {return {name: elem.name, id: elem.id||elem.src}})}
                btnText="del"
                itemClickFn={manageList ? selectList : playMusic}
                btnClickFn={manageList ? deleteList : removeMusic}/>
        </div>
    )
}

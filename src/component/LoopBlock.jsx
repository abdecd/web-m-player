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
        setSpecificList(WebMusicManager.list);
        setSpecificListTempName(WebMusicManager.list.name);
        //对后续变化
        var refreshFn = list => {
            setSpecificList(list);
            setSpecificListTempName(WebMusicManager.list.name);
            WebMusicListStorage.set(list.name,list);
        };
        WebMusicManager.list.subscribe(refreshFn);
        return () => WebMusicManager.list.unSubscribe(refreshFn);
    },[WebMusicManager.list]);

    //订阅nameList
    useEffect(() => {
        setNameList(WebMusicListStorage.names);
        //对后续变化
        var refreshFn = names => setNameList(names);
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
        var newList = new WebMusicList(name);
        WebMusicListStorage.set(name,newList);
    },[]);

    var selectList = useCallback(elem => {
        var newList = new WebMusicList(elem.name,WebMusicListStorage.get(elem.name));
        WebMusicManager.list = newList;
        setManageList(false);
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
                                WebMusicListStorage.remove(specificList.name);
                                WebMusicManager.list.name = ev.target.value;
                                WebMusicListStorage.set(ev.target.value,specificList);
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

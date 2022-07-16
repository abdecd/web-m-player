import React, { useCallback, useEffect, useState } from 'react'
import { List, ListItemText, ListItemButton, ListItem } from '@mui/material'

import style from '../css/LoopBlock.module.css'
import WebMusicManager from '../js/WebMusicManager'

export default function LoopBlock() {
    const [listData, setListData] = useState([]);

    //订阅LoopList
    useEffect(() => {
        var refreshFn = list => setListData(list);
        WebMusicManager.list.subscribe(refreshFn);
        return () => WebMusicManager.list.unSubscribe(refreshFn);
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

    return (
        <div className={style.LoopBlock}>
        {
            (!listData || listData.length==0) ? (
                <p>null</p>
            ) : (
                <List>
                {
                    listData?.map(elem => (
                        <ListItem key={elem.id || elem.src}>
                            <ListItemButton style={{flex: 9}} onClick={() => playMusic(elem)}>
                                <ListItemText primary={elem.name}/>
                            </ListItemButton>

                            <ListItemButton
                                style={{textAlign: "center", fontSize: "20px", flex: 1, color: "gray"}}
                                onClick={() => removeMusic(elem)}>
                                <ListItemText>del</ListItemText>
                            </ListItemButton>
                        </ListItem>
                    ))
                }
                </List>
            )
        }
        </div>
    )
}

import React, { useCallback } from 'react'
import { List, ListItemText, ListItemButton, ListItem } from '@mui/material'

import WebMusicManager from '../../js/WebMusicManager';
import musicAjax from '../../js/musicAjax';

export default function BasicList({listData}) {
    //listData <==> [{ id or url, name, author },...]

    var playMusic = useCallback(async elem => {
        if (await WebMusicManager.load(elem.name, elem.id || null, elem.url || await musicAjax.fetchSrc(elem.id))) {
            WebMusicManager.play();
        } else {
            console.info("载入失败，可能为付费歌曲。");
        }
    },[]);

    var addMusic = useCallback(async elem => {
        if (!WebMusicManager.push(elem.name, elem.id || null, elem.url || await musicAjax.fetchSrc(elem.id)))
            console.info("添加至播放列表失败，可能为付费歌曲。");
    },[]);

    return (
        <div>
            <List>
            {
                listData?.map(elem => (
                    <ListItem key={elem.id || elem.url}>
                        <ListItemButton style={{flex: 9}} onClick={() => playMusic(elem)}>
                            <ListItemText primary={elem.name} secondary={elem.author}/>
                        </ListItemButton>

                        <ListItemButton
                            style={{textAlign: "center", fontSize: "20px", flex: 1, color: "gray"}}
                            onClick={() => addMusic(elem)}>
                            <ListItemText>+</ListItemText>
                        </ListItemButton>
                    </ListItem>
                ))
            }
            </List>
        </div>
    )
}

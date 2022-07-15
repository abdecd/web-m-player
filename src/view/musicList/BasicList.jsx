import React, { useCallback } from 'react'
import { List, ListItemText, ListItemButton, ListItem } from '@mui/material'

import WebMusicManager from '../../js/WebMusicManager';
import musicAjax from '../../js/musicAjax';

export default function BasicList({listData}) {
    //listData <==> [{ id or url, name, author },...]

    var playMusic = useCallback(async elem => {
        if (await WebMusicManager.load(elem.name, elem.id || null, elem.url || await musicAjax.fetchSrc(elem.id)))
            WebMusicManager.play();
    },[]);

    var addMusic = useCallback(async elem => {
        WebMusicManager.push(elem.name, elem.id || null, elem.url || await musicAjax.fetchSrc(elem.id));
    },[]);

    return (
        <div>
            <List>
            {
                listData?.map(elem => (
                    //todo: 添加到歌单等
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

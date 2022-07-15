import React from 'react'
import { List, ListItemText, ListItemButton } from '@mui/material'

import WebMusicManager from '../../js/WebMusicManager';
import musicAjax from '../../js/musicAjax';

export default function BasicList({listData}) {
    //listData <==> [{ id or url, name, author },...]
    return (
        <div>
            <List>
            {
                listData?.map(elem => (
                    //todo: 添加到歌单等
                    <ListItemButton key={elem.id || elem.url} onClick={async () => {
                        WebMusicManager.load(elem.name, elem.id || null, elem.url || await musicAjax.fetchSrc(elem.id));
                    }}>
                        <ListItemText primary={elem.name} secondary={elem.author}/>
                    </ListItemButton>
                ))
            }
            </List>
        </div>
    )
}

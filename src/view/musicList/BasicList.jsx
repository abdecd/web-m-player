import React, { useCallback } from 'react'
import { List, ListItemText, ListItemButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import WebMusicManager from '../../js/WebMusicManager';
import axios from 'axios';

export default function BasicList({listData}) {
    //listData <==> [{ id, name, author },...]
    var navigate = useNavigate();

    var fetchMusicSrc = useCallback(async musicId => (await axios(`/api/song/enhance/player/url?ids=[${musicId}]&br=999000`)).data.data[0].url,[]);

    return (
        <div>
            <List>
            {
                listData
                .map(elem => (
                    //todo: 添加到歌单等
                    <ListItemButton key={elem.id} onClick={async () => {
                        navigate("/lyric/"+elem.id);
                        var url = await fetchMusicSrc(elem.id);
                        WebMusicManager.load(elem.name,url);
                    }}>
                        <ListItemText primary={elem.name} secondary={elem.author}/>
                    </ListItemButton>
                ))
            }
            </List>
        </div>
    )
}

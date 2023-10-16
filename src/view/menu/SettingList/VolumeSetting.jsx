import { ListItem, ListItemText, Slider } from '@mui/material'
import React, { useState } from 'react'
import webMusicManager from '../../../js/webMusicManager'

export default function VolumeSetting() {
    const [volume, setVolume] = useState(webMusicManager.volume*100);

    return (
        <ListItem style={{justifyContent: "space-between"}}>
            <ListItemText style={{flex: "1 0", margin: "0 20px 0 0"}}>音量设置</ListItemText>
            <Slider
                value={volume}
                min={0}
                max={100}
                valueLabelDisplay='auto'
                valueLabelFormat={x=>x+"%"}
                onChange={(_,value)=>{
                    setVolume(value);
                    webMusicManager.volume = value/100;
                }}
                sx={{"&":{width: "40%", marginRight: "15px"}}}
            />
        </ListItem>
    )
}

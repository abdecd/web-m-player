import React, { useState, useEffect, useCallback } from 'react'
import { Button, LinearProgress } from '@mui/material'

import WebMusicManager from '../state/WebMusicManager'

import style from '../css/MusicBar.module.css'

export default function MusicBar() {
    const [title, setTitle] = useState("");
    const [progressValue, setProgressValue] = useState(0);

    useEffect(() => {
        var refreshTitle = () => setTitle(WebMusicManager.title);
        WebMusicManager.addLoadStartEventListener(refreshTitle);
        return () => WebMusicManager.removeLoadStartEventListener(refreshTitle);
    },[]);

    useEffect(() => {
        var refreshProgress = () => setProgressValue(WebMusicManager.getCurrentTime()/WebMusicManager.getMaxTime());
        WebMusicManager.addTimeUpdateEventListener(refreshProgress);
        return () => WebMusicManager.removeTimeUpdateEventListener(refreshProgress);
    },[]);

    var lFn = useCallback(() => WebMusicManager.setCurrentTime(WebMusicManager.getCurrentTime()-10));
    var rFn = useCallback(() => WebMusicManager.setCurrentTime(WebMusicManager.getCurrentTime()+10));
    var playBtnFn = useCallback(() => WebMusicManager.playPause());
    
    return (
        <div className={style.MusicBar}>
            <div className={style.LinearFlex}>
                <p>{title}</p>
                <div className={style.ButtonBar}>
                    <Button variant="contained" onClick={lFn}>L</Button>
                    <Button variant="contained" onClick={rFn}>R</Button>
                    <Button variant="contained" onClick={playBtnFn}>^_^</Button>
                </div>
            </div>
            <LinearProgress variant='determinate' value={progressValue}/>
        </div>
    )
}

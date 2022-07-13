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

    // var lFn = useCallback(() => );
    // var rFn = useCallback(() => );
    // var playBtnFn = useCallback(() => );
    
    return (
        <div className={style.MusicBar}>
            <div className={style.LinearFlex}>
                <p>{title}</p>
                <div className={style.ButtonBar}>
                    <Button variant="contained">L</Button>
                    <Button variant="contained">R</Button>
                    <Button variant="contained">^_^</Button>
                </div>
            </div>
            <LinearProgress variant='determinate' value={progressValue}/>
        </div>
    )
}

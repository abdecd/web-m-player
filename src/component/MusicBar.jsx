import React, { useState, useEffect, useCallback } from 'react'
import { Box, Button, LinearProgress } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'

import WebMusicManager from '../js/WebMusicManager'

import style from '../css/MusicBar.module.css'
import musicAjax from '../js/musicAjax'

export default function MusicBar() {
    const [title, setTitle] = useState("");
    const [progressValue, setProgressValue] = useState(0);
    const [playBtnStr, setPlayBtnStr] = useState("×_×");

    var navigate = useNavigate();
    var location = useLocation();

    //订阅title
    useEffect(() => {
        var refreshTitle = () => setTitle(WebMusicManager.title);
        WebMusicManager.addLoadStartEventListener(refreshTitle);
        return () => WebMusicManager.removeLoadStartEventListener(refreshTitle);
    },[]);

    //订阅秒数变化
    useEffect(() => {
        var refreshProgress = () => setProgressValue(WebMusicManager.getCurrentTime()/WebMusicManager.getMaxTime()*100);
        WebMusicManager.addTimeUpdateEventListener(refreshProgress);
        return () => WebMusicManager.removeTimeUpdateEventListener(refreshProgress);
    },[]);

    var lFn = useCallback(() => WebMusicManager.setCurrentTime(WebMusicManager.getCurrentTime()-10));
    var rFn = useCallback(() => WebMusicManager.setCurrentTime(WebMusicManager.getCurrentTime()+10));
    var playBtnFn = useCallback(() => WebMusicManager.playPause() ? setPlayBtnStr("^_^") : setPlayBtnStr("×_×"));

    var getMusicId = useCallback(async musicName => (await musicAjax.fetchSearch(musicName))?.[0].id,[]);
    var turnToLyric = useCallback(async () => {
        if (!WebMusicManager.id) WebMusicManager.id = await getMusicId(WebMusicManager.title);
        var newPath = "/lyric/"+WebMusicManager.id;
        if (location.pathname!=newPath) navigate(newPath);
    },[location]);
    
    return (
        <div className={style.MusicBar}>
            <div className={style.LinearFlex}>
                <p onClick={() => title ? turnToLyric() : 1}>{title}</p>
                <Box className={style.ButtonBar} sx={{'& .MuiButton-root': { width: '10vw', minWidth: '0px' }}}>
                    <Button variant="contained" disableElevation onClick={lFn}>L</Button>
                    <Button variant="contained" disableElevation onClick={rFn}>R</Button>
                    <Button variant="contained" disableElevation onClick={playBtnFn}>{playBtnStr}</Button>
                </Box>
            </div>
            <LinearProgress variant='determinate' value={progressValue}/>
        </div>
    )
}

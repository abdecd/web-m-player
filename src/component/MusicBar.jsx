import React, { useState, useEffect, useCallback } from 'react'
import { Box, Button, LinearProgress } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'

import WebMusicManager from '../js/WebMusicManager'

import style from '../css/MusicBar.module.css'
import musicAjax from '../js/musicAjax'
import betterDblClick from '../js/BetterDblClick'

export default function MusicBar({toggleLoopBlockShown}) {
    const [title, setTitle] = useState("");
    const [progressValue, setProgressValue] = useState(0);
    const [playBtnStr, setPlayBtnStr] = useState("×_×");
    const [loopBtnStr, setLoopBtnStr] = useState("⇌");

    var navigate = useNavigate();
    var location = useLocation();

    //订阅title
    useEffect(() => {
        var refreshTitle = () => setTitle(WebMusicManager.name);
        WebMusicManager.handler.addEventListener("loadstart",refreshTitle);
        return () => WebMusicManager.handler.removeEventListener("loadstart",refreshTitle);
    },[]);

    //订阅秒数变化
    useEffect(() => {
        var refreshProgress = () => setProgressValue(WebMusicManager.getCurrentTime()/WebMusicManager.getMaxTime()*100);
        WebMusicManager.handler.addEventListener("timeupdate",refreshProgress);
        return () => WebMusicManager.handler.removeEventListener("timeupdate",refreshProgress);
    },[]);

    //订阅播放状态变化
    useEffect(() => {
        var playPlayBtn = () => setPlayBtnStr("^_^");
        var pausePlayBtn = () => setPlayBtnStr("×_×");
        WebMusicManager.handler.addEventListener("play",playPlayBtn);
        WebMusicManager.handler.addEventListener("pause",pausePlayBtn);
        return () => {
            WebMusicManager.handler.removeEventListener("play",playPlayBtn);
            WebMusicManager.handler.removeEventListener("pause",pausePlayBtn);
        }
    },[]);

    var lFn = useCallback(() => WebMusicManager.setCurrentTime(WebMusicManager.getCurrentTime()-10),[]);
    var lDblFn = useCallback(async () => (await WebMusicManager.before()) ? WebMusicManager.play() : 1,[]);
    var rFn = useCallback(() => WebMusicManager.setCurrentTime(WebMusicManager.getCurrentTime()+10),[]);
    var rDblFn = useCallback(async () => (await WebMusicManager.nextByLoopOrder()) ? WebMusicManager.play() : 1,[]);
    var playBtnFn = useCallback(() => WebMusicManager.playPause(),[]);
    var loopBtnFn = useCallback(betterDblClick(
        () => {
            if (loopBtnStr=="⇌") {
                WebMusicManager.loopMode = "repeat";
                setLoopBtnStr("↺");
            } else if (loopBtnStr=="↺") {
                WebMusicManager.loopMode = "random";
                setLoopBtnStr("↝");
            } else if (loopBtnStr=="↝") {
                WebMusicManager.loopMode = "next";
                setLoopBtnStr("⇌");
            }
        },
        () => toggleLoopBlockShown()
    ),[loopBtnStr,toggleLoopBlockShown]);

    var getMusicId = useCallback(async musicName => (await musicAjax.fetchSearch(musicName))?.[0].id,[]);
    var turnToLyric = useCallback(async () => {
        if (!title) return;
        if (!WebMusicManager.id) WebMusicManager.id = await getMusicId(WebMusicManager.name);
        var newPath = "/lyric/"+WebMusicManager.id;
        if (location.pathname!=newPath) navigate(newPath);
    },[title,location]);
    
    return (
        <div className={style.MusicBar}>
            <div className={style.LinearFlex}>
                <p onClick={turnToLyric}>{title}</p>
                <Box className={style.ButtonBar} sx={{'& .MuiButton-root': { width: '10vw', minWidth: '0px' }}}>
                    <Button variant="contained" disableElevation onClick={loopBtnFn}>{loopBtnStr}</Button>
                    <Button variant="contained" disableElevation onClick={lFn} onDoubleClick={lDblFn}>L</Button>
                    <Button variant="contained" disableElevation onClick={rFn} onDoubleClick={rDblFn}>R</Button>
                    <Button variant="contained" disableElevation onClick={playBtnFn}>{playBtnStr}</Button>
                </Box>
            </div>
            <LinearProgress variant='determinate' value={progressValue}/>
        </div>
    )
}

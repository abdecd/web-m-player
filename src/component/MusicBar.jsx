import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Button, LinearProgress } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'

import webMusicManager from '../js/webMusicManager'

import style from './MusicBar.module.css'
import bindLongClick from '../js/click/bindLongClick'
import musicAjax from '../js/nativeBridge/musicAjax'
import showTips from '../js/showTips'
import LoadingBlock from './LoadingBlock'
import undoFnContainer from '../js/reactHooks/supportUndoMusicList'

export default React.memo(function MusicBar({toggleLoopBlockShown}) {
    const [title, setTitle] = useState("");
    const [progressValue, setProgressValue] = useState(0);
    const [playBtnStr, setPlayBtnStr] = useState("×_×");
    const [loopBtnStr, setLoopBtnStr] = useState("⇌");
    const [loading, setLoading] = useState(true);

    var navigate = useNavigate();
    var location = useLocation();

    //订阅title
    useEffect(() => {
        var refreshTitle = name => {
            setTitle(name);
            setLoading(true);
        };
        setTitle(webMusicManager.name);
        webMusicManager.addNameChangeListener(refreshTitle);
        return () => webMusicManager.removeNameChangeListener(refreshTitle);
    },[]);

    //订阅加载状态
    useEffect(() => {
        var loadFn = () => setLoading(false);
        webMusicManager.handler.addEventListener("canplay",loadFn);
        return () => webMusicManager.handler.removeEventListener("canplay",loadFn);
    },[]);

    //订阅秒数变化
    useEffect(() => {
        var refreshProgress = () => setProgressValue(webMusicManager.getCurrentTime()/webMusicManager.getMaxTime()*100);
        webMusicManager.handler.addEventListener("timeupdate",refreshProgress);
        return () => webMusicManager.handler.removeEventListener("timeupdate",refreshProgress);
    },[]);

    //订阅播放状态变化
    useEffect(() => {
        var playPlayBtn = () => setPlayBtnStr("^_^");
        var pausePlayBtn = () => setPlayBtnStr("×_×");
        webMusicManager.handler.addEventListener("play",playPlayBtn);
        webMusicManager.handler.addEventListener("pause",pausePlayBtn);
        return () => {
            webMusicManager.handler.removeEventListener("play",playPlayBtn);
            webMusicManager.handler.removeEventListener("pause",pausePlayBtn);
        }
    },[]);

    var lFn = useCallback(() => webMusicManager.setCurrentTime(webMusicManager.getCurrentTime()-10),[]);
    var rFn = useCallback(() => webMusicManager.setCurrentTime(webMusicManager.getCurrentTime()+10),[]);
    var lDblFn = useCallback(async () => {
        if (webMusicManager.previousList.length>1) {
            await webMusicManager.before();
            webMusicManager.play();
        } else {
            showTips.info("播放列表中暂无歌曲。");
        }
    },[]);
    var rDblFn = useCallback(async () => {
        if (webMusicManager.list.length || webMusicManager.aheadList.length) {
            await webMusicManager.nextByLoopOrder();
            webMusicManager.play();
        } else {
            showTips.info("播放列表中暂无歌曲。");
        }
    },[]);

    var playBtn = useRef();
    useEffect(() => {
        bindLongClick(
            playBtn.current,
            () => webMusicManager.playPause(),
            () => showTips.prompt("path: ",webMusicManager.src)
        );
    },[]);

    var loopBtn = useRef();
    useEffect(() => {
        bindLongClick(
            loopBtn.current,
            () => {
                if (loopBtnStr=="⇌") {
                    webMusicManager.loopMode = "repeat";
                    setLoopBtnStr("↸");
                    showTips.info("单曲循环");
                } else if (loopBtnStr=="↸") {
                    webMusicManager.loopMode = "random";
                    setLoopBtnStr("↝");
                    showTips.info("随机播放");
                } else if (loopBtnStr=="↝") {
                    webMusicManager.loopMode = "next";
                    setLoopBtnStr("⇌");
                    showTips.info("列表循环");
                }
            },
            () => toggleLoopBlockShown()
        );
    },[loopBtnStr,toggleLoopBlockShown]);

    var noLyricLocation = useRef({L: "/"});
    var getMusicId = useCallback(async musicName => (await musicAjax.fetchSearch(musicName))?.[0].id,[]);
    var toggleLyric = useCallback(async () => {
        if (location.pathname.startsWith("/lyric")) {
            navigate(noLyricLocation.current.L);
        } else {
            if (!title) return;
            noLyricLocation.current.L = location.pathname+location.search;
            if (!webMusicManager.id) webMusicManager.musicObj.id = await getMusicId(webMusicManager.name).catch(e => {showTips.info("获取歌曲对应id失败，无法获取歌词。"); throw e});
            navigate("/lyric/"+webMusicManager.musicObj.id);
        }
    },[title,location]);

    var undoSpecificListFn = undoFnContainer.value;

    var titleBlock = useRef();
    useEffect(() => {
        bindLongClick(
            titleBlock.current,
            toggleLyric,
            () => {
                switch (webMusicManager.push(webMusicManager.name, webMusicManager.handler.src, webMusicManager.id)) {
                    case webMusicManager.PUSH_STATE.SUCCESS:
                        return showTips.info("添加至播放列表成功。",undoSpecificListFn);
                    case webMusicManager.PUSH_STATE.EXISTS:
                        return showTips.info("该项目已存在。");
                    case webMusicManager.PUSH_STATE.FAILED:
                        return showTips.info("添加至播放列表失败。");
                }
            }
        )
    },[toggleLyric]);

    return (
        <div className={style.MusicBar}>
            <div className={style.LinearFlex}>
                <LoadingBlock loading={loading} className={style.TitleBar}>
                    <p ref={titleBlock}>{title}</p>
                </LoadingBlock>
                <div className={style.ButtonBar}>
                    <Button variant="contained" disableElevation ref={loopBtn}>{loopBtnStr}</Button>
                    <Button variant="contained" disableElevation onClick={lFn} onDoubleClick={lDblFn}>
                        <svg style={{width: "1.25em",height: "1.25em",flex: "1 0 auto",verticalAlign: "middle",fill: "currentColor",overflow: "hidden"}} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5604"><path d="M357.3 324v376c0 17.6-14.4 32-32 32s-32-14.4-32-32V324c0-17.6 14.4-32 32-32s32 14.4 32 32zM400.5 512c0 9 4.4 17.4 11.7 22.6l275.2 192.6c8.4 5.9 19.4 6.5 28.5 1.9 9.1-4.7 14.8-14.1 14.8-24.4V319.4c0-10.3-5.7-19.6-14.8-24.4-9.1-4.7-20.1-4-28.5 1.9L412.3 489.5a27.29 27.29 0 0 0-11.8 22.5z" fill="" p-id="5605"></path></svg>
                    </Button>
                    <Button variant="contained" disableElevation onClick={rFn} onDoubleClick={rDblFn}>
                        <svg style={{width: "1.25em",height: "1.25em",flex: "1 0 auto",verticalAlign: "middle",fill: "currentColor",overflow: "hidden"}} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3747"><path d="M698.7 292c17.6 0 32 14.4 32 32v376c0 17.6-14.4 32-32 32s-32-14.4-32-32V324c0-17.6 14.4-32 32-32zM611.7 489.5L336.6 296.9c-8.4-5.9-19.4-6.6-28.5-1.9-9.1 4.8-14.8 14.1-14.8 24.4v385.3c0 10.3 5.7 19.7 14.8 24.4 9.1 4.6 20.1 4 28.5-1.9l275.2-192.6c7.3-5.2 11.7-13.6 11.7-22.6 0-9-4.4-17.4-11.8-22.5z" fill="" p-id="3748"></path></svg>
                    </Button>
                    <Button variant="contained" disableElevation ref={playBtn}>{playBtnStr}</Button>
                </div>
            </div>
            <LinearProgress variant='determinate' value={progressValue}/>
        </div>
    )
})
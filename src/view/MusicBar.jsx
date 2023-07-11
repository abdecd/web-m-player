import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Button, Slider } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'

import webMusicManager from '../js/webMusicManager'

import bindLongClick from '../js/click/bindLongClick'
import musicAjax from '../js/nativeBridge/musicAjax'
import showTips from '../js/showTips'
import LoadingBlock from '../component/LoadingBlock'
import undoFnContainer from '../js/reactHooks/supportUndoMusicList'
import useStateReferrer from '../js/reactHooks/useStateReferrer'
import { styled } from 'styled-components'

const StyledMusicBar = styled.div`
    backdrop-filter: blur(8px);
    position: fixed;
    left: 0px;
    bottom: 0px;
    z-index: 1;
    width: 100%;
    height: var(--musicbar-height);
    display: flex;
    flex-direction: column;
`

const StyledContentBar = styled.div`
    display: flex;
    justify-content: center;
    min-height: 0;
    flex: 1 1 0;
`

const StyledTitle = styled(LoadingBlock)`
    flex: 1;
    margin-left: 10px;
    white-space: nowrap;
    overflow-x: auto;
    user-select: none;
    scrollbar-width: none;
    padding: 0;
    &::-webkit-scrollbar {
        width: 0;
        height: 0;
    }
`

const StyledButtonBar = styled.div`
    display: flex;
    justify-content: flex-end;
    Button {
        color: #EEEEEE;
        background-color: #548cc8de;

        width: 2.6em;
        min-width: 0px;
        min-height: 0px;

        margin: 12px 10px;
        margin-left: 0;
    }
`

export default React.memo(function MusicBar({toggleLoopBlockShown}) {
    const [title, setTitle] = useState("");
    const [progressValue, setProgressValue] = useState(0);
    const [playBtnStr, setPlayBtnStr] = useState("×_×");
    const [loopBtnStr, setLoopBtnStr] = useState("⇌");
    const [loading, setLoading] = useState(true);

    var navigate = useNavigate();

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

    const progressModifying = useRef(false);
    //订阅秒数变化
    useEffect(() => {
        var refreshProgress = () => !progressModifying.current && setProgressValue(webMusicManager.getCurrentTime());
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

    var lFn = useCallback(async () => {
        if (webMusicManager.previousList.length>1) {
            await webMusicManager.before();
            webMusicManager.play();
        } else {
            showTips.info("播放列表中暂无歌曲。");
        }
    },[]);
    var rFn = useCallback(async () => {
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
            () => showTips.prompt("name and path: ",webMusicManager.name+" "+webMusicManager.src)
        );
    },[]);

    var loopBtn = useRef();
    const loopBtnStrReferrer = useStateReferrer(loopBtnStr);
    useEffect(() => {
        bindLongClick(
            loopBtn.current,
            () => {
                var loopBtnStr = loopBtnStrReferrer.current;
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
            toggleLoopBlockShown
        );
    },[toggleLoopBlockShown]);

    // 点击title转到歌词
    var noLyricLocation = useRef("/");
    var undoSpecificListFn = undoFnContainer.value;
    var titleReferrer = useStateReferrer(title);
    var locationReferrer = useStateReferrer(useLocation());
    var titleBlock = useRef();
    useEffect(() => {
        var getMusicId = async musicName => (await musicAjax.fetchSearch(musicName))?.[0].id;
        var toggleLyric = async () => {
            var location = locationReferrer.current;
            if (location.pathname.startsWith("/lyric")) {
                navigate(noLyricLocation.current);
            } else {
                var title = titleReferrer.current;
                if (!title) return;
                noLyricLocation.current = location.pathname+location.search;
                if (!webMusicManager.id) webMusicManager.musicObj.id = await getMusicId(webMusicManager.name).catch(e => {showTips.info("获取歌曲对应id失败，无法获取歌词。"); throw e});
                navigate("/lyric/"+webMusicManager.musicObj.id);
            }
        };

        var addCurrentMusic = () => {
            switch (webMusicManager.push(webMusicManager.name, webMusicManager.src, webMusicManager.id)) {
                case webMusicManager.PUSH_STATE.SUCCESS:
                    return showTips.info("添加至播放列表成功。",undoSpecificListFn);
                case webMusicManager.PUSH_STATE.EXISTS:
                    return showTips.info("该项目已存在。");
                case webMusicManager.PUSH_STATE.FAILED:
                    return showTips.info("添加至播放列表失败。");
            }
        };

        bindLongClick(
            titleBlock.current,
            toggleLyric,
            addCurrentMusic
        )
    },[]);

    return (
        <StyledMusicBar>
            <Slider
                size='small'
                value={progressValue}
                min={0}
                max={webMusicManager.getMaxTime()}
                valueLabelDisplay='auto'
                valueLabelFormat={n=>`${~~(n/60)}:`+`${~~(n%60)}`.padStart(2,'0')}
                onChange={(_,value)=>{
                    progressModifying.current = true;
                    setProgressValue(value);
                }}
                onChangeCommitted={(_,value)=>{
                    webMusicManager.setCurrentTime(value)
                    progressModifying.current = false;
                }}
                sx={{'&':{ padding: 0 }}}
            />
            <StyledContentBar>
                <StyledTitle loading={loading}>
                    <p ref={titleBlock}>{title}</p>
                </StyledTitle>
                <StyledButtonBar>
                    <Button variant="contained" disableElevation ref={loopBtn}>{loopBtnStr}</Button>
                    <Button variant="contained" disableElevation onClick={lFn}>
                        <svg style={{width: "1.25em",height: "1.25em",flex: "1 0 auto",verticalAlign: "middle",fill: "currentColor",overflow: "hidden"}} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5604"><path d="M357.3 324v376c0 17.6-14.4 32-32 32s-32-14.4-32-32V324c0-17.6 14.4-32 32-32s32 14.4 32 32zM400.5 512c0 9 4.4 17.4 11.7 22.6l275.2 192.6c8.4 5.9 19.4 6.5 28.5 1.9 9.1-4.7 14.8-14.1 14.8-24.4V319.4c0-10.3-5.7-19.6-14.8-24.4-9.1-4.7-20.1-4-28.5 1.9L412.3 489.5a27.29 27.29 0 0 0-11.8 22.5z" fill="" p-id="5605"></path></svg>
                    </Button>
                    <Button variant="contained" disableElevation onClick={rFn}>
                        <svg style={{width: "1.25em",height: "1.25em",flex: "1 0 auto",verticalAlign: "middle",fill: "currentColor",overflow: "hidden"}} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3747"><path d="M698.7 292c17.6 0 32 14.4 32 32v376c0 17.6-14.4 32-32 32s-32-14.4-32-32V324c0-17.6 14.4-32 32-32zM611.7 489.5L336.6 296.9c-8.4-5.9-19.4-6.6-28.5-1.9-9.1 4.8-14.8 14.1-14.8 24.4v385.3c0 10.3 5.7 19.7 14.8 24.4 9.1 4.6 20.1 4 28.5-1.9l275.2-192.6c7.3-5.2 11.7-13.6 11.7-22.6 0-9-4.4-17.4-11.8-22.5z" fill="" p-id="3748"></path></svg>
                    </Button>
                    <Button variant="contained" disableElevation ref={playBtn}>{playBtnStr}</Button>
                </StyledButtonBar>
            </StyledContentBar>
        </StyledMusicBar>
    )
})
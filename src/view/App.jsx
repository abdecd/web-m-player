import React, { useCallback, useEffect, useState } from 'react'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import BackgroundBlock from '../component/BackgroundBlock';
import LoopBlock, { BasicLoopBlock } from './LoopBlock';
import MusicBar from './MusicBar'
import ToastBar from '../component/ToastBar';
import settings, { initSettings } from '../js/settings';
import undoFnContainer, { useUndoableMusicList } from '../js/reactHooks/supportUndoMusicList';
import theme from '../js/theme';
import './App.css'

initSettings();

export default function App({children}) {
    const [currentTheme, setCurrentTheme] = useState(theme.value);
    useEffect(() => theme.changeSub.subscribe(() => setCurrentTheme(theme.value)),[]);

    const [backgroundType, backgroundSrc] = useBackgroundListerner();
    const [screenWidth] = useWidthWatcher();
    const MIN_PC_WIDTH = 600;

    const [loopBlockShown, setLoopBlockShown] = useState(false);
    const toggleLoopBlockShown = useCallback(() => setLoopBlockShown(shown => !shown),[]);
    undoFnContainer.value = useUndoableMusicList();

    return (
        <ThemeProvider theme={currentTheme}>
            <CssBaseline/>
            <div style={{height: "calc(100vh - 60px)", overflow: "auto"}}>
                {screenWidth<MIN_PC_WIDTH ? (
                    <LoopBlock shown={loopBlockShown} setShown={setLoopBlockShown}/>
                ) : (
                    <>
                    <BasicLoopBlock style={{height: "100%", width: "35%", float: "left"}}/>
                    <div style={{height: "100%", width: "3px", background: "#22222244", float: "left", borderRadius: "2px"}}/>
                    </>
                )}
                {children}
            </div>

            <BackgroundBlock type={backgroundType} src={backgroundSrc}/>
            <ToastBar/>
            
            {/* height: 60px */}
            <MusicBar toggleLoopBlockShown={toggleLoopBlockShown}/>
        </ThemeProvider>
    )
}

function useWidthWatcher() {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        var td;
        var fn = () => {
            clearTimeout(td);
            td = setTimeout(() => setScreenWidth(window.innerWidth),300);
        };
        window.addEventListener("resize",fn,{passive: true});
        return () => window.removeEventListener("resize",fn);
    },[]);

    return [screenWidth, setScreenWidth];
}

function useBackgroundListerner() {
    const [backgroundType, setBackgroundType] = useState("image");
    const [backgroundSrc, setBackgroundSrc] = useState("");

    useEffect(() => settings.backgroundSub.subscribe((newType,url) => {
        setBackgroundType(newType);
        setBackgroundSrc(url);
    }),[]);

    return [backgroundType, backgroundSrc];
}
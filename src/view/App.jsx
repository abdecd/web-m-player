import React, { useEffect, useState } from 'react'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import BackgroundBlock from '../component/BackgroundBlock';
import LoopBlock, { BasicLoopBlock } from './LoopBlock';
import MusicBar from '../component/MusicBar'
import ToastBar from '../component/ToastBar';
import settings, { initSettings } from '../js/settings';
import undoFnContainer, { useUndoableMusicList } from '../js/reactHooks/supportUndoMusicList';
import theme from '../js/theme';
import './App.css'

initSettings();

export default function App({children}) {
    const [currentTheme, setCurrentTheme] = useState(theme.value);

    const [backgroundType, setBackgroundType] = useState("image");
    const [backgroundSrc, setBackgroundSrc] = useState("");

    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const MIN_PC_WIDTH = 600;

    const [loopBlockShown, setLoopBlockShown] = useState(false);
    undoFnContainer.value = useUndoableMusicList();
    
    useEffect(() => theme.changeSub.subscribe(() => setCurrentTheme(theme.value)),[]);
    useEffect(() => settings.backgroundSub.subscribe((newType,url) => {
        setBackgroundType(newType);
        setBackgroundSrc(url);
    }),[]);
    useEffect(() => {
        var td;
        var fn = () => {
            clearTimeout(td);
            td = setTimeout(() => setScreenWidth(window.innerWidth),300);
        };
        window.addEventListener("resize",fn);
        return () => window.removeEventListener("resize",fn);
    },[]);

    return (
        <ThemeProvider theme={currentTheme}>
            <CssBaseline/>
            <div style={{height: "calc(100vh - 60px)", overflow: "auto"}}>
                {screenWidth<MIN_PC_WIDTH ? (
                    <LoopBlock shown={loopBlockShown} setShown={setLoopBlockShown}/>
                ) : (
                    <>
                    <BasicLoopBlock style={{height: "100%", width: "35%", float: "left"}}/>
                    <div style={{height: "100%", width: "3px", background: "#22222244", float: "left"}}/>
                    </>
                )}
                {children}
            </div>

            <BackgroundBlock type={backgroundType} src={backgroundSrc}/>
            <ToastBar/>
            
            {/* height: 60px */}
            <MusicBar toggleLoopBlockShown={() => setLoopBlockShown(!loopBlockShown)}/>
        </ThemeProvider>
    )
}
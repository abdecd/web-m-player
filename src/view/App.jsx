import React, { useEffect, useState } from 'react'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import BackgroundBlock from '../component/BackgroundBlock';
import LoopBlock from '../component/LoopBlock';
import MusicBar from '../component/MusicBar'
import ToastBar from '../component/ToastBar';
import settings, { initSettings } from '../js/settings';
import undoFnContainer, { useUndoableMusicList } from '../js/reactHooks/supportUndoMusicList';
import theme from './Theme';
import './App.css'

initSettings();

export default function App({children}) {
    const [loopBlockShown, setLoopBlockShown] = useState(false);
    const [currentTheme, setCurrentTheme] = useState(theme.value);
    const [backgroundType, setBackgroundType] = useState("image");
    const [backgroundSrc, setBackgroundSrc] = useState("");
    undoFnContainer.value = useUndoableMusicList();
    
    useEffect(() => theme.changeSub.subscribe(() => setCurrentTheme(theme.value)),[]);
    useEffect(() => settings.backgroundSub.subscribe((newType,url) => {
        setBackgroundType(newType);
        setBackgroundSrc(url);
    }),[]);

    return (
        <ThemeProvider theme={currentTheme}>
            <CssBaseline/>
            <div style={{height: "calc(100vh - 60px)", overflow: "auto"}}>
                {children}
            </div>

            <BackgroundBlock type={backgroundType} src={backgroundSrc}/>
            <ToastBar/>
            <LoopBlock shown={loopBlockShown} setShown={setLoopBlockShown}/>
            
            {/* height: 60px */}
            <MusicBar toggleLoopBlockShown={() => setLoopBlockShown(!loopBlockShown)}/>
        </ThemeProvider>
    )
}
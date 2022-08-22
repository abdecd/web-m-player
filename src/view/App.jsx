import React, { useEffect, useState } from 'react'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import BackgroundBlock from '../component/BackgroundBlock';
import LoopBlock from '../component/LoopBlock';
import MusicBar from '../component/MusicBar'
import ToastBar from '../component/ToastBar';
import { initSettings } from '../js/settings';
import undoFnContainer, { useUndoableMusicList } from '../js/supportUndoMusicList';
import theme from './Theme';

initSettings();

export default function App({children}) {
    const [loopBlockShown, setLoopBlockShown] = useState(false);
    const [currentTheme, setCurrentTheme] = useState(theme.value);
    undoFnContainer.value = useUndoableMusicList();
    
    useEffect(() => {
        var refreshFn = () => setCurrentTheme(theme.value);
        theme.changeSub.add(refreshFn);
        return () => theme.changeSub.remove(refreshFn);
    },[]);

    return (
        <ThemeProvider theme={currentTheme}>
            <CssBaseline/>
            <div style={{height: "calc(100vh - 60px)", overflow: "auto"}}>
                {children}
            </div>

            <BackgroundBlock/>
            <ToastBar/>
            <LoopBlock shown={loopBlockShown} setShown={setLoopBlockShown}/>
            
            {/* height: 60px */}
            <MusicBar toggleLoopBlockShown={() => setLoopBlockShown(!loopBlockShown)}/>
        </ThemeProvider>
    )
}
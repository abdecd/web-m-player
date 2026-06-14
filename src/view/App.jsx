import React, { useCallback, useEffect, useState } from 'react'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import BackgroundBlock from '../component/BackgroundBlock';
import LoopBlock, { BasicLoopBlock } from './LoopBlock';
import MusicBar from './MusicBar'
import ToastBar from '../component/ToastBar';
import settings, { initSettings } from '../js/settings';
import undoFnContainer, { useUndoableMusicList } from '../js/reactHooks/supportUndoMusicList';
import themeManager from '../js/themeManager';
import './App.css'
import { styled } from 'styled-components';
import mediaSessionProvider from '../js/nativeBridge/mediaSessionProvider';

initSettings();
mediaSessionProvider.provide();

const StyledContent = styled.div`
    height: 100vh;
    overflow: hidden;
    display: flex;
    > :nth-last-child(1) {
        flex: 1 1;
        overflow: auto;
    }
`

const StyledLoopBlockWrapper = styled.div`
    height: calc(100% - var(--musicbar-height));
    width: 35%;
`

export default function App({children}) {
    const [currentTheme, setCurrentTheme] = useState(themeManager.getThemeObj());
    useEffect(() => themeManager.changeSub.subscribe(() => setCurrentTheme(themeManager.getThemeObj())),[]);

    const [backgroundType, backgroundSrc] = useBackgroundListerner();
    const [screenWidth] = useWidthWatcher();
    const MIN_PC_WIDTH = 600;

    const [loopBlockShown, setLoopBlockShown] = useState(false);
    const toggleLoopBlockShown = useCallback(() => setLoopBlockShown(shown => !shown),[]);
    undoFnContainer.value = useUndoableMusicList();

    return (
        <ThemeProvider theme={currentTheme}>
            <CssBaseline/>
            <StyledContent>
                {screenWidth<MIN_PC_WIDTH ? (
                    <LoopBlock shown={loopBlockShown} setShown={setLoopBlockShown}/>
                ) : (
                    <>
                        <StyledLoopBlockWrapper>
                            <BasicLoopBlock/>
                        </StyledLoopBlockWrapper>
                        <div style={{width: "1px", flex: "0 0 auto", height: "calc(100% - var(--musicbar-height))", backgroundColor: "#00000026", alignSelf: "start"}}></div>
                    </>
                )}
                {children}
            </StyledContent>

            <BackgroundBlock type={backgroundType} src={backgroundSrc}/>
            <ToastBar/>
            
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

    useEffect(() => {
        settings.getBackground().then(background => {
            if (background) {
                setBackgroundType(background.type);
                setBackgroundSrc(background.type == "basic" ? background.value : (background.value || ""));
            }
        });
        return settings.backgroundSub.subscribe((newType,url) => {
            setBackgroundType(newType);
            setBackgroundSrc(url);
        });
    },[]);

    return [backgroundType, backgroundSrc];
}
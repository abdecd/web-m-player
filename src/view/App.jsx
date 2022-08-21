import React, { useState } from 'react'
import BackgroundBlock from '../component/BackgroundBlock';

import LoopBlock from '../component/LoopBlock';
import MusicBar from '../component/MusicBar'
import ToastBar from '../component/ToastBar';
import { initSettings } from '../js/settings';
import undoFnContainer, { useUndoableMusicList } from '../js/supportUndoMusicList';

initSettings();

export default function App({children}) {
    const [loopBlockShown, setLoopBlockShown] = useState(false);

    undoFnContainer.value = useUndoableMusicList();

    return (
        <div>
            {/* margin: 8px */}
            <div style={{height: "calc(100vh - 68px)", overflow: "auto"}}>
                {children}
            </div>

            <BackgroundBlock/>
            <ToastBar/>
            <LoopBlock shown={loopBlockShown} setShown={setLoopBlockShown}/>
            
            {/* height: 60px */}
            <MusicBar toggleLoopBlockShown={() => setLoopBlockShown(!loopBlockShown)}/>
        </div>
    )
}
import React, { useState } from 'react'

import LoopBlock from '../component/LoopBlock';
import MusicBar from '../component/MusicBar'
import ToastBarGroup from '../component/ToastBarGroup';
import { initSettings } from '../js/settingsStorage';

initSettings();

export default function App({children}) {
    const [loopBlockShown, setLoopBlockShown] = useState(false);

    return (
        <div>
            {/* margin: 8px */}
            <div style={{height: "calc(100vh - 76px)", overflow: "auto"}}>
                {children}
            </div>
            {/* mask */}
            <div style={{position: "fixed", top: "0", left: "0", width: "100vw", height: "100vh", zIndex: "-1", backdropFilter: "contrast(60%) brightness(120%)"}}></div>

            <ToastBarGroup/>
            <LoopBlock shown={loopBlockShown} setShown={setLoopBlockShown}/>
            
            {/* height: 60px */}
            <MusicBar toggleLoopBlockShown={() => setLoopBlockShown(!loopBlockShown)}/>
        </div>
    )
}

import React, { useState } from 'react'

import LoopBlock from '../component/LoopBlock';
import MusicBar from '../component/MusicBar'
import { initSettings } from '../js/settingsStorage';

initSettings();

export default function App({children}) {
    const [loopBlockShown, setLoopBlockShown] = useState(false);

    return (
        <div>
            <div style={{height: "calc(100vh - 60px)", overflow: "auto"}}>
                {children}
            </div>
            {/* mask */}
            <div style={{position: "fixed", top: "0", left: "0", width: "100vw", height: "100vh", zIndex: "-1", backdropFilter: "blur(1px) contrast(80%)"}}></div>

            <LoopBlock shown={loopBlockShown} setShown={setLoopBlockShown}/>
            
            {/* height: 60px */}
            <MusicBar toggleLoopBlockShown={() => setLoopBlockShown(!loopBlockShown)}/>
        </div>
    )
}

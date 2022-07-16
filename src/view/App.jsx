import React, { useState } from 'react'
import LoopBlock from '../component/LoopBlock';

import MusicBar from '../component/MusicBar'

export default function App({children}) {
    const [loopBlockShown, setLoopBlockShown] = useState(false);
    return (
        <div>
            <div style={{height: "calc(100vh - 60px)", overflow: "auto"}}>
                {children}
            </div>

            {loopBlockShown && <div style={{position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh"}} onClick={() => setLoopBlockShown(false)}></div>}
            <div style={{
                transition: "0.3s",
                opacity: (loopBlockShown ? 1 : 0),
                position: 'fixed',
                right: "3vw",
                bottom: (loopBlockShown ? "60px" : "20px"),
                pointerEvents: (loopBlockShown ? "auto" : "none")
            }}>
                <LoopBlock/>
            </div>
            
            <MusicBar toggleLoopBlockShown={() => setLoopBlockShown(!loopBlockShown)}/>
        </div>
    )
}

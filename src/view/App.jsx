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
            <div style={{
                transition: "0.5s",
                opacity: (loopBlockShown ? 1 : 0),
                position: 'fixed',
                right: "3vw",
                bottom: (loopBlockShown ? "60px" : "0px"),
                pointerEvents: (loopBlockShown ? "auto" : "none")
            }}>
                <LoopBlock/>
            </div>
            <MusicBar toggleLoopBlockShown={() => setLoopBlockShown(!loopBlockShown)}/>
        </div>
    )
}

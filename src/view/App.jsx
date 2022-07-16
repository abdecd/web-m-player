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
            <div style={{transition: "0.2s", opacity: (loopBlockShown ? 1 : 0), pointerEvents: (loopBlockShown ? "auto" : "none")}}>
                <LoopBlock/>
            </div>
            <MusicBar toggleLoopBlockShown={() => setLoopBlockShown(!loopBlockShown)}/>
        </div>
    )
}

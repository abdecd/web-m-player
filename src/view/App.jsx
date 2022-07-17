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

            <LoopBlock shown={loopBlockShown} setShown={setLoopBlockShown}/>
            
            {/* height: 60px */}
            <MusicBar toggleLoopBlockShown={() => setLoopBlockShown(!loopBlockShown)}/>
        </div>
    )
}

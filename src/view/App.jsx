import React from 'react'

import MusicBar from '../component/MusicBar'

export default function App({children}) {
    return (
        <div>
            <div style={{height: "calc(100vh - 60px)", overflow: "auto"}}>
                {children}
            </div>
            <MusicBar/>
        </div>
    )
}

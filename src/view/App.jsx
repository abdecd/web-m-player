import React from 'react'

import MusicBar from '../component/MusicBar'

export default function App({children}) {
    return (
        <div>
            <p>App</p>
            {children}
            <MusicBar/>
        </div>
    )
}

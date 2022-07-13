import React from 'react'

import MusicBar from '../component/MusicBar'

export default function App({children}) {
    return (
        <div>
            {children}
            <MusicBar/>
        </div>
    )
}

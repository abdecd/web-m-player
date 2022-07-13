import React from 'react'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import style from '../css/LinearBar.module.css'

export default function MusicList({children}) {
    var navigate = useNavigate();

    return (
        <div>
            <p>MusicList</p>
            <div className={style.LinearBar}>
                <Button onClick={() => navigate("localList")}>LocalList</Button>
                <Button onClick={() => navigate("onlineList")}>OnlineList</Button>
            </div>
            {children}
        </div>
    )
}

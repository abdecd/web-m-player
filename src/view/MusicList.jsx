import React from 'react'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import style from '../css/LinearBar.module.css'

export default function MusicList({children}) {
    var navigate = useNavigate();

    return (
        <div>
            <div className={style.LinearBar}>
                <Button onClick={() => navigate("localList")}>LocalList</Button>
                <Button onClick={() => navigate("onlineList")}>OnlineList</Button>
                <Button onClick={() => navigate("search")}>Search</Button>
            </div>
            {children}
        </div>
    )
}

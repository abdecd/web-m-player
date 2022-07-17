import React from 'react'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import style from '../css/LinearBar.module.css'

export default function MusicList({children}) {
    var navigate = useNavigate();

    return (
        <div style={{height: "100%"}}>
            <div className={style.LinearBar} style={{height: "30px"}}>
                <Button onClick={() => navigate("localList")}>LocalList</Button>
                <Button onClick={() => navigate("onlineList")}>OnlineList</Button>
                <Button onClick={() => navigate("search")}>Search</Button>
            </div>
            <div style={{height: "calc(100% - 30px)", overflow: "auto"}}>
                {children}
            </div>
        </div>
    )
}

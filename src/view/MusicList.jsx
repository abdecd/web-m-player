import React from 'react'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import style from '../css/LinearBar.module.css'

export default function MusicList({children}) {
    var navigate = useNavigate();

    return (
        <div style={{height: "100%"}}>
            <div className={style.LinearBar} style={{height: "30px"}}>
                <Button onClick={() => navigate("localList")}>本地</Button>
                <Button onClick={() => navigate("onlineList")}>网络</Button>
                <Button onClick={() => navigate("search")}>搜索</Button>
            </div>
            <div style={{height: "calc(100% - 30px)", overflow: "auto"}}>
                {children}
            </div>
        </div>
    )
}

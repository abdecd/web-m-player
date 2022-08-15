import React from 'react'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import style from '../css/LinearBar.module.css'

function SettingsBtn() {
    var navigate = useNavigate();
    return (
        <Button
            style={{minWidth: "30px", height:"30px"}}
            onClick={() => navigate("settings")}>
            <svg width="30px" height="30px">
                <polygon points="5,15 10,6.34 20,6.34 25,15 20,23.66 10,23.66" fill="rgba(0,0,0,0)" stroke="black" strokeWidth="1"/>
                <circle cx="15" cy="15" r="4" stroke="black" strokeWidth="1" fill="rgba(0,0,0,0)"/>
            </svg>
        </Button>
    );
}

export default function Menu({children}) {
    var navigate = useNavigate();

    return (
        <div style={{height: "100%"}}>
            <div style={{display: "flex"}}>
                <SettingsBtn/>
                <div className={style.LinearBar} style={{height: "30px", flex: "1"}}>
                    <Button onClick={() => navigate("localList")}>本地</Button>
                    <Button onClick={() => navigate("onlineList")}>网络</Button>
                    <Button onClick={() => navigate("search")}>搜索</Button>
                </div>
            </div>

            <div style={{height: "calc(100% - 30px)", overflow: "auto"}}>
                {children}
            </div>
        </div>
    )
}

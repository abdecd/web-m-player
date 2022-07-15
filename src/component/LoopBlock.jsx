import React from 'react'

import style from '../css/LoopBlock.module.css'

export default function LoopBlock({shown}) {
    return (
        <div className={style.LoopBlock} style={{
            transition: "0.2s",
            opacity: shown ? "1" : "0",
            pointerEvents: shown ? "auto" : "none",
        }}>LoopBlock</div>
    )
}

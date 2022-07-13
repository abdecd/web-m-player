import React from 'react'
import { Button, LinearProgress } from '@mui/material'

import style from '../css/MusicBar.module.css'

export default function MusicBar({title,progressValue}) {
  return (
    <div className={style.MusicBar}>
        <div className={style.LinearFlex}>
            <p>{title}</p>
            <div className={style.ButtonBar}>
                <Button variant="contained">L</Button>
                <Button variant="contained">R</Button>
                <Button variant="contained">^_^</Button>
            </div>
        </div>
        <LinearProgress variant='determinate' value={progressValue}/>
    </div>
  )
}

import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Snackbar from '@mui/material/Snackbar';
import React, { useEffect, useRef, useState } from 'react'

import showTips from '../js/showTips';

export default function ToastBar() {
    const [msg, setMsg] = useState("");
    const [open, setOpen] = useState(false);

    var undoFn = useRef(null);

    useEffect(() => {
        var refreshFn = (msg,fn) => {
            undoFn.current = fn ?? null;
            if (open) {
                setOpen(false);
                setTimeout(() => { setMsg(msg); setOpen(true); },200);
            } else {
                setOpen(true);
                setMsg(msg);
            }
        }
        showTips.subscribe(refreshFn);
        return () => showTips.unSubscribe(refreshFn);
    },[open]);// todo: 减少重绑定

    return (
        <Snackbar
            open={open}
            autoHideDuration={2000}
            TransitionComponent={Fade}
            onClose={(ev, reason) => {
                if (reason === 'clickaway') return;
                setOpen(false);
            }}
            message={msg}
            action={undoFn.current && <Button onClick={() => { undoFn.current(); setOpen(false); }} size="small">撤销</Button>}
            style={{bottom: "68px", opacity: "0.8"}}/>
    )
}
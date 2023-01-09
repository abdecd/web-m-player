import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Snackbar from '@mui/material/Snackbar';
import React, { useEffect, useRef, useState } from 'react'

import showTips from '../js/showTips';

export default React.memo(function ToastBar() {
    const [msg, setMsg] = useState("");
    const [open, setOpen] = useState(false);
    const openReferrer = useRef(open);
    useEffect(() => { openReferrer.current = open; },[open]);

    var undoFn = useRef(null);

    useEffect(() => showTips.changeSub.subscribe((msg,fn) => {
        undoFn.current = fn ?? null;
        if (openReferrer.current) {
            setOpen(false);
            setTimeout(() => { setMsg(msg); setOpen(true); },200);
        } else {
            setOpen(true);
            setMsg(msg);
        }
    }),[]);

    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            TransitionComponent={Fade}
            onClose={(ev, reason) => {
                if (reason === 'clickaway') return;
                setOpen(false);
            }}
            message={msg}
            action={undoFn.current && <Button onClick={() => { undoFn.current(); showTips.info("撤销成功。"); }} size="small">撤销</Button>}
            style={{bottom: "68px", opacity: "0.8"}}/>
        // margin: 8px
    )
})
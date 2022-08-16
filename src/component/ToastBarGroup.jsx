import Snackbar from '@mui/material/Snackbar';
import React, { useEffect, useState } from 'react'

import showTips from '../js/showTips';

export default function ToastBarGroup() {
    const [msg, setMsg] = useState("");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        var refreshFn = msg => {
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
    },[open]);

    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={() => setOpen(false)}
            message={msg}
            style={{bottom: "60px", opacity: "0.8"}}/>
    )
}
import { ListItemButton, ListItemText, useTheme } from '@mui/material';
import React, { useRef, useEffect } from 'react'
import bindLongClick from '../js/click/bindLongClick'

var LeftItem = React.memo(({name,subName,clickFn,longClickFn,shouldHighLight}) => {
    var btn = useRef();
    useEffect(() => {
        bindLongClick(btn.current,clickFn,longClickFn);
    },[clickFn,longClickFn]);

    return (
        <ListItemButton ref={btn} style={{flex: 9}}>
            <ListItemText primary={name} secondary={subName} sx={shouldHighLight ? {"span": {color: "#1976d2"}} : null}/>
        </ListItemButton>
    )
});

var RightBtn = React.memo(({btnText,clickFn,longClickFn,style}) => {
    var btn = useRef();
    useEffect(() => {
        bindLongClick(btn.current,clickFn,longClickFn);
    },[clickFn,longClickFn]);
    var theme = useTheme();

    return (
        <ListItemButton
            ref={btn}
            style={{textAlign: "center", flex: "0.06 1 auto", color: theme.palette.text.secondary, ...style}}>
            <ListItemText>{btnText}</ListItemText>
        </ListItemButton>
    )
});

export {
    LeftItem,
    RightBtn
};
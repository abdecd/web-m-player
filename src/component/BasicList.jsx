import React, { useEffect, useRef } from 'react'
import { List, ListItemText, ListItem, useTheme } from '@mui/material'
import BScroll from '@better-scroll/core';

export default function BasicList({children,style}) {
    //listData <==> [{name,subName?,key},...]
    var theme = useTheme();
    var wrapper = useRef();
    var bScrollStorage = useRef();

    useEffect(() => { bScrollStorage.current = new BScroll(wrapper.current); });
    useEffect(() => { bScrollStorage.current.refresh(); },[children]);

    return (
        <div ref={wrapper} style={{height: "100%", textAlign: "center", overflow: "hidden", ...style}}>
        {(!children.length) ? (
            <p>当前列表为空。</p>
        ) : (
            <List sx={{'& .MuiListItem-root': {padding: "0px",alignItems: "stretch"}}}>
                { children }
                <ListItem style={{textAlign: "center", color: theme.palette.text.secondary}}>
                    <ListItemText>共{children.length}项</ListItemText>
                </ListItem>
            </List>
        )}
        </div>
    )
}
import React from 'react'
import { List, ListItemText, ListItem, useTheme } from '@mui/material'

export default function BasicList({children,style,innerRef}) {
    //listData <==> [{name,subName?,key},...]
    var theme = useTheme();

    // todo: 长列表优化
    return (
        <div ref={innerRef} style={{height: "100%", textAlign: "center", overflow: "auto", ...style}}>
        {(!children.length) ? (
            <p>当前列表为空。</p>
        ) : (
            <>
            <List sx={{'& .MuiListItem-root': {padding: "0px",alignItems: "stretch"}}}>
                { children }
                
            </List>
            <ListItem style={{textAlign: "center", color: theme.palette.text.secondary}}>
                <ListItemText>共{children.length}项</ListItemText>
            </ListItem>
            </>
        )}
        </div>
    )
}
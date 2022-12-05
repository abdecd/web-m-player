import React from 'react'
import { List, ListItemText, ListItem, useTheme } from '@mui/material'
import cssStyle from './BasicList.module.css'

export default function BasicList({children,style}) {
    //listData <==> [{name,subName?,key},...]
    var theme = useTheme();

    return (
        <div className={cssStyle.BasicList} style={{height: "100%", textAlign: "center", overflow: "auto", scrollbarWidth: "none", ...style}}>
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
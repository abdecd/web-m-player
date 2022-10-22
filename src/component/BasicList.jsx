import React, { useEffect, useRef } from 'react'
import { List, ListItemText, ListItemButton, ListItem, useTheme } from '@mui/material'
import bindLongClick from '../js/click/bindLongClick'

function LeftItem({name,subName,clickFn,longClickFn,shouldHighLight}) {
    var btn = useRef();
    useEffect(() => {
        bindLongClick(btn.current,clickFn,longClickFn);
    },[clickFn,longClickFn]);

    return (
        <ListItemButton ref={btn} style={{flex: 9}}>
            <ListItemText primary={name} secondary={subName} sx={shouldHighLight ? {"span": {color: "#1976d2"}} : null}/>
        </ListItemButton>
    )
}

function RightBtn({btnText,clickFn,longClickFn}) {
    var btn = useRef();
    useEffect(() => {
        bindLongClick(btn.current,clickFn,longClickFn);
    },[clickFn,longClickFn]);
    var theme = useTheme();

    return (
        <ListItemButton
            ref={btn}
            style={{textAlign: "center", flex: 1, color: theme.palette.text.secondary}}>
            <ListItemText>{btnText}</ListItemText>
        </ListItemButton>
    )
}

export default function BasicList({listData,btnText,itemClickFn=(function(){}),itemLongClickFn=(function(){}),btnClickFn=(function(){}),btnLongClickFn=(function(){}),style,currentIndex}) {
    //listData <==> [{name,subName?,key},...]
    var theme = useTheme();

    return (
        <div style={{height: "100%", textAlign: "center", overflow: "auto", ...style}}>
        {(!listData || listData.length==0) ? (
            <p>当前列表为空。</p>
        ) : (
            <List>
            {
                listData?.map((elem,index) => (
                    <ListItem key={elem.key} style={{padding: "0px",alignItems: "stretch"}}>
                        <LeftItem name={elem.name} subName={elem.subName} clickFn={ev => itemClickFn(ev,elem)} longClickFn={ev => itemLongClickFn(ev,elem)} shouldHighLight={index==currentIndex}/>
                        <RightBtn btnText={btnText} clickFn={ev => btnClickFn(ev,elem)} longClickFn={ev => btnLongClickFn(ev,elem)}/>
                    </ListItem>
                ))
            }
                <ListItem style={{textAlign: "center", color: theme.palette.text.secondary}}>
                    <ListItemText>共{listData.length}项</ListItemText>
                </ListItem>
            </List>
        )}
        </div>
    )
}

import React, { useEffect, useRef } from 'react'
import { List, ListItemText, ListItemButton, ListItem } from '@mui/material'
import bindLongClick from '../js/click/bindLongClick'

function LeftItem({name,subName,clickFn,longClickFn}) {
    var btn = useRef();
    useEffect(() => {
        bindLongClick(btn.current,clickFn,longClickFn);
    },[btn]);

    return (
        <ListItemButton ref={btn} style={{flex: 9}}>
            <ListItemText primary={name} secondary={subName}/>
        </ListItemButton>
    )
}

function RightBtn({btnText,clickFn,longClickFn}) {
    var btn = useRef();
    useEffect(() => {
        bindLongClick(btn.current,clickFn,longClickFn);
    },[btn]);

    return (
        <ListItemButton
            ref={btn}
            style={{textAlign: "center", flex: 1, color: "gray"}}>
            <ListItemText>{btnText}</ListItemText>
        </ListItemButton>
    )
}

export default function BasicList({listData,btnText,itemClickFn=(function(){}),itemLongClickFn=(function(){}),btnClickFn=(function(){}),btnLongClickFn=(function(){})}) {
    //listData <==> [{name,subName?,key},...]
    return (
        <div style={{height: "100%", textAlign: "center", overflow: "auto"}}>
        {(!listData || listData.length==0) ? (
            <p>当前列表为空。</p>
        ) : (
            <List>
            {
                listData?.map(elem => (
                    <ListItem key={elem.key} style={{padding: "0px",alignItems: "stretch"}}>
                        <LeftItem name={elem.name} subName={elem.subName} clickFn={ev => itemClickFn(ev,elem)} longClickFn={ev => itemLongClickFn(ev,elem)}/>
                        <RightBtn btnText={btnText} clickFn={ev => btnClickFn(ev,elem)} longClickFn={ev => btnLongClickFn(ev,elem)}/>
                    </ListItem>
                ))
            }
                <ListItem style={{textAlign: "center", color: "gray"}}>
                    <ListItemText>共{listData.length}项</ListItemText>
                </ListItem>
            </List>
        )}
        </div>
    )
}

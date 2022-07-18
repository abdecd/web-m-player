import React, { useEffect, useRef } from 'react'
import { List, ListItemText, ListItemButton, ListItem } from '@mui/material'
import bindLongClick from '../js/click/bindLongClick'

function RightBtn({btnText,clickFn,longClickFn}) {
    var btn = useRef();
    useEffect(() => {
        bindLongClick(btn.current,clickFn,longClickFn);
    },[btn]);

    return (
        <ListItemButton
            ref={btn}
            style={{textAlign: "center", fontSize: "20px", flex: 1, color: "gray"}}>
            <ListItemText>{btnText}</ListItemText>
        </ListItemButton>
    )
}

export default function BasicList({listData,btnText,itemClickFn,btnClickFn,btnLongClickFn}) {
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
                        <ListItemButton style={{flex: 9}} onClick={ev => itemClickFn(ev,elem)}>
                            <ListItemText primary={elem.name} secondary={elem.subName}/>
                        </ListItemButton>

                        <RightBtn btnText={btnText} clickFn={ev => btnClickFn(ev,elem)} longClickFn={ev => btnLongClickFn(ev,elem)}/>
                    </ListItem>
                ))
            }
            </List>
        )}
        </div>
    )
}

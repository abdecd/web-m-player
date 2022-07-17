import React, { useEffect, useRef } from 'react'
import { List, ListItemText, ListItemButton, ListItem } from '@mui/material'
import bindLongClick from '../js/bindLongClick'

function RightBtn({btnText,clickFn,longClickFn}) {
    var btn = useRef();
    useEffect(() => {
        bindLongClick(btn.current,clickFn,longClickFn);
    },[btn]);

    return <ListItemButton
        ref={btn}
        style={{textAlign: "center", fontSize: "20px", flex: 1, color: "gray"}}>
        <ListItemText>{btnText}</ListItemText>
    </ListItemButton>
}

export default function BasicList({listData,btnText,itemClickFn,btnClickFn,btnLongClickFn}) {
    //listData <==> [{name,subName?,id},...]
    return <>
    {
        (!listData || listData.length==0) ? (
            <p>当前列表为空。</p>
        ) : (
            <List>
            {
                listData?.map(elem => (
                    <ListItem key={elem.id} style={{padding: "0px",alignItems: "stretch"}}>
                        <ListItemButton style={{flex: 9}} onClick={() => itemClickFn(elem)}>
                            <ListItemText primary={elem.name} secondary={elem.subName}/>
                        </ListItemButton>

                        <RightBtn btnText={btnText} clickFn={() => btnClickFn(elem)} longClickFn={() => btnLongClickFn(elem)}/>
                    </ListItem>
                ))
            }
            </List>
        )
    }
    </>
}

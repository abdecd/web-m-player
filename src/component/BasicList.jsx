import React from 'react'
import { List, ListItemText, ListItemButton, ListItem } from '@mui/material'

export default function BasicList({listData,btnText,itemClickFn,btnClickFn}) {
    //listData <==> [{name,subName?,id},...]
    return <>
    {
        (!listData || listData.length==0) ? (
            <p>当前列表为空。</p>
        ) : (
            <List>
            {
                listData?.map(elem => (
                    <ListItem key={elem.id}>
                        <ListItemButton style={{flex: 9}} onClick={() => itemClickFn(elem)}>
                            <ListItemText primary={elem.name} secondary={elem.subName}/>
                        </ListItemButton>

                        <ListItemButton
                            style={{textAlign: "center", fontSize: "20px", flex: 1, color: "gray"}}
                            onClick={() => btnClickFn(elem)}>
                            <ListItemText>{btnText}</ListItemText>
                        </ListItemButton>
                    </ListItem>
                ))
            }
            </List>
        )
    }
    </>
}

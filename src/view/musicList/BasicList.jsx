import React from 'react'

import { List, ListItemText, ListItemButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function BasicList({listData}) {
    var navigate = useNavigate();
    return (
        <div>
            <p>List</p>
            <List>
            {
                listData
                .map(elem => (
                    <ListItemButton key={elem.id} onClick={() => navigate("/lyric/"+elem.id)}>
                        <ListItemText primary={elem.name} secondary={elem.author}/>
                    </ListItemButton>
                ))
            }
            </List>
        </div>
    )
}

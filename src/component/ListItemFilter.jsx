import React from 'react'
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';

export default function Filter({searchWord,setSearchWord,inputStyle}) {
    return (
        <form style={{marginLeft: "8px", marginRight: "8px"}} onSubmit={ev => { ev.preventDefault(); ev.target.childNodes[0].querySelector("input").blur(); }}>
            <Input
                startAdornment={<InputAdornment position='start'>keyword: </InputAdornment>}
                style={inputStyle}
                value={searchWord}
                fullWidth
                onChange={ev => setSearchWord(ev.target.value)}/>
        </form>
    );
}
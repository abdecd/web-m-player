import React, { useEffect, useState } from 'react'
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import PinyinEngine from 'pinyin-engine';

export default function Filter({listData,setFilterList,inputStyle}) {
    const [searchWord, setSearchWord] = useState("");
    const [pinyinDir, setPinyinDir] = useState({query(){return []}});

    useEffect(() => {
        setPinyinDir(new PinyinEngine(listData,["name"],true));
    },[listData]);

    useEffect(() => {
        setFilterList(pinyinDir.query(searchWord));
    },[pinyinDir,searchWord]);

    return (
        <form style={{marginLeft: "10px", marginRight: "10px"}} onSubmit={ev => { ev.preventDefault(); ev.target.childNodes[0].querySelector("input").blur(); }}>
            <Input
                startAdornment={<InputAdornment position='start'>keyword: </InputAdornment>}
                style={inputStyle}
                value={searchWord}
                fullWidth
                onChange={ev => setSearchWord(ev.target.value)}/>
        </form>
    );
}
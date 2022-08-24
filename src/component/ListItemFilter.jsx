import React, { useEffect, useState, useRef } from 'react'
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import PinyinEngine from 'pinyin-engine';

export default function Filter({listData,setFilterList,style,inputStyle}) {
    const [searchWord, setSearchWord] = useState("");
    const [pinyinDir, setPinyinDir] = useState({query(){return []}});
    const initLoad = useRef({ "setFilterList": false });

    useEffect(() => {
        setPinyinDir(new PinyinEngine(listData,["name"],true));
    },[listData]);

    useEffect(() => {
        if (!initLoad.current["setFilterList"]) { initLoad.current["setFilterList"] = true; return; }
        setFilterList(pinyinDir.query(searchWord));
    },[pinyinDir,searchWord]);

    return (
        <form style={{marginLeft: "10px", marginRight: "10px", ...style}} onSubmit={ev => { ev.preventDefault(); ev.target.childNodes[0].querySelector("input").blur(); }}>
            <Input
                startAdornment={<InputAdornment position='start'>keyword: </InputAdornment>}
                value={searchWord}
                style={inputStyle}
                fullWidth
                onChange={ev => setSearchWord(ev.target.value)}/>
        </form>
    );
}
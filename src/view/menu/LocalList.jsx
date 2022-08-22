import { Button, Input, InputAdornment } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react'
import MusicList from './MusicList'
import musicAjax from '../../js/nativeBridge/musicAjax'
import LoadingBlock from '../../component/LoadingBlock';
import PinyinEngine from 'pinyin-engine';

export default function LocalList() {
    const [listData, setListData] = useState({});
    const [searchWord, setSearchWord] = useState("");
    const [loading, setLoading] = useState(true);

    var fetchLocalList = useCallback(async () => {
        setLoading(true);
        setListData(new PinyinEngine(await musicAjax.loadLocalListSync() || [],["name"],true));
        setLoading(false);
    },[]);

    //初始载入
    useEffect(() => { fetchLocalList(); },[]);

    return (
        <LoadingBlock loading={loading} style={{height: "100%", textAlign: "center", overflow: "hidden"}}>
        { (!listData.query?.("").length) ? (
            (loading) ? (
                <p>refreshing...</p>
            ) : (
                <>
                <p>Nothing in "/sdcard/Music".</p>
                <Button variant='outlined' disableRipple onClick={fetchLocalList}>refresh</Button>
                </>
            )
        ) : (
            <>
            <Filter searchWord={searchWord} setSearchWord={setSearchWord} inputStyle={{width:"92vw", height: "1.6em"}}/>
            <MusicList listData={listData.query?.(searchWord)} style={{height: "calc(100% - 1.6em)"}}/>
            </>
        ) }
        </LoadingBlock>
    )
}

function Filter({searchWord,setSearchWord,inputStyle}) {
    return (
        <form onSubmit={ev => { ev.preventDefault(); ev.target.childNodes[0].querySelector("input").blur(); }}>
            <Input
                startAdornment={<InputAdornment position='start'>keyword: </InputAdornment>}
                style={inputStyle}
                value={searchWord}
                onChange={ev => setSearchWord(ev.target.value)}/>
        </form>
    );
}
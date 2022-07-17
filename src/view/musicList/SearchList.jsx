import { Box, Input } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import musicAjax from '../../js/musicAjax';
import BBasicList from './BBasicList';

export default function SearchList() {
    var [searchParams,setSearchParams] = useSearchParams({ word: "" });
    const [searchData, setSearchData] = useState([]);
    const [loading, setLoading] = useState(true);

    var searchFn = useCallback(async word => {
        setLoading(true);
        var ans = await musicAjax.fetchSearch(word);
        setSearchData(ans);
        setLoading(false);
    },[]);

    //载入时搜索
    useEffect(() => { searchParams.get("word") ? searchFn(searchParams.get("word")) : 1 },[]);

    return (
        <Box style={{textAlign: "center"}} sx={{'& .MuiInput-root': { width: '92vw' }}}>
            <Input
                value={searchParams.get("word")}
                onChange={ev => setSearchParams({ word: ev.target.value }) }
                onKeyDown={ev => ev.key=="Enter" ? searchFn(searchParams.get("word")) : 1}>
            </Input>
            <div style={{transition: "0.2s", opacity: (loading ? 0.35 : 1), height: "calc(96vh - 60px - 2em)", overflow: "auto"}}>
                <BBasicList listData={searchData}/>
            </div>
        </Box>
    )
}

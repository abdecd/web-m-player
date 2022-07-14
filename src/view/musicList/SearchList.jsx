import { Box, Input } from '@mui/material';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import BasicList from './BasicList';

export default function SearchList() {
    var [searchParams,setSearchParams] = useSearchParams({ word: "" });
    const [searchData, setSearchData] = useState([]);

    var searchFn = useCallback(async word => {
        var ans = (await axios(`/api/search/get?s=${word}&type=1&limit=30`)).data;
        ans = ans.result.songs.map(elem => { return {
            id: elem.id,
            name: elem.name,
            author: elem.artists.map(artist => artist.name).join("、")
        } });
        setSearchData(ans);
    },[]);

    //载入时搜索
    useEffect(() => { searchParams.get("word") ? searchFn(searchParams.get("word")) : 1 },[]);

    return (
        <Box sx={{'& .MuiInput-root': { width: '100%' }}}>
            <Input
                value={searchParams.get("word")}
                onChange={ev => setSearchParams({ word: ev.target.value }) }
                onKeyDown={ev => ev.key=="Enter" ? searchFn(searchParams.get("word")) : 1}>
            </Input>
            <BasicList listData={searchData}/>
        </Box>
    )
}

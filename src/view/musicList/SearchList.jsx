import { Box, Input } from '@mui/material';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import BasicList from './BasicList';

export default function SearchList() {
    var [searchParams,setSearchParams] = useSearchParams({ word: "" });
    const [searchData, setSearchData] = useState([]);
    const [loading, setLoading] = useState(true);

    var searchFn = useCallback(async word => {
        //设置加载效果
        setLoading(true);

        var ans = (await axios(`/api/search/get?s=${word}&type=1&limit=30`)).data;
        ans = ans.result.songs.map(elem => { return {
            id: elem.id,
            name: elem.name,
            author: elem.artists.map(artist => artist.name).join("、")
        } });
        setSearchData(ans);

        setLoading(false);
    },[]);

    //载入时搜索
    useEffect(() => { searchParams.get("word") ? searchFn(searchParams.get("word")) : 1 },[]);

    return (
        <Box sx={{'& .MuiInput-root': { marginLeft: "2vw", width: '92vw' }}}>
            <Input
                value={searchParams.get("word")}
                onChange={ev => setSearchParams({ word: ev.target.value }) }
                onKeyDown={ev => ev.key=="Enter" ? searchFn(searchParams.get("word")) : 1}>
            </Input>
            <div style={{transition: "0.2s", opacity: (loading ? 0.35 : 1), height: "calc(96vh - 60px - 2em)", overflow: "auto"}}>
                <BasicList listData={searchData}/>
            </div>
        </Box>
    )
}

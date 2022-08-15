import { Input } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import musicAjax from '../../js/nativeBridge/musicAjax';
import BBasicList from './BBasicList';

export default function SearchList() {
    var [searchParams,setSearchParams] = useSearchParams({word: ""});
    const [searchWord, setSearchWord] = useState("");
    const [searchData, setSearchData] = useState([]);
    const [loading, setLoading] = useState(false);

    var searchFn = useCallback(async word => {
        setLoading(true);
        var ans = await musicAjax.fetchSearch(word);
        setSearchData(ans);
        setLoading(false);
    },[]);

    //载入时搜索
    useEffect(() => {
        var word = searchParams.get("word");
        if (word) {
            setSearchWord(word);
            searchFn(word);
        }
    },[]);

    return (
        <div style={{textAlign: "center", height: "100%"}}>
            <form
                onSubmit={ev => {
                    ev.preventDefault();
                    if (!searchWord) return;
                    setSearchParams({word: searchWord});
                    searchFn(searchWord);
                    ev.target.childNodes[0].querySelector("input").blur();
                }}>
                <Input
                    style={{width:"92vw", height: "2em"}}
                    value={searchWord}
                    onChange={ev => setSearchWord(ev.target.value)}/>
            </form>
            <div style={{transition: "0.2s", opacity: (loading ? 0.35 : 1), height: "calc(100% - 2em)", overflow: "auto"}}>
                <BBasicList listData={searchData} loading={loading}/>
            </div>
        </div>
    )
}

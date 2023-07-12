import { Input } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import LoadingBlock from '../../component/LoadingBlock';
import musicAjax from '../../js/nativeBridge/musicAjax';
import showTips from '../../js/showTips';
import MusicList from './MusicList';
import { styled } from 'styled-components';

const StyledSearchList = styled.div`
    height: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    > :nth-child(2) {
        flex: 1 1;
        overflow: auto;
    }
`

export default function SearchList() {
    var [searchParams,setSearchParams] = useSearchParams({word: ""});
    const [searchWord, setSearchWord] = useState("");
    const [searchData, setSearchData] = useState([]);
    const [loading, setLoading] = useState(false);

    var searchFn = useCallback(async word => {
        setLoading(true);
        var ans = await musicAjax.fetchSearch(word)
            .catch(e => {showTips.info("搜索失败。"); return []})
            || [];
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
        <StyledSearchList>
            <form
                style={{marginLeft: "10px", marginRight: "10px"}}
                onSubmit={ev => {
                    ev.preventDefault();
                    if (!searchWord) return;
                    setSearchParams({word: searchWord});
                    searchFn(searchWord);
                    ev.target.childNodes[0].querySelector("input").blur();
                }}>
                <Input
                    style={{height: "2em"}}
                    fullWidth
                    value={searchWord}
                    onChange={ev => setSearchWord(ev.target.value)}/>
            </form>
            <LoadingBlock loading={loading}>
                <MusicList listData={searchData} loading={loading}/>
            </LoadingBlock>
        </StyledSearchList>
    )
}

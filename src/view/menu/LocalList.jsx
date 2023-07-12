import { Button } from '@mui/material';
import React, { useCallback, useEffect, useState, useRef } from 'react'
import MusicList from './MusicList'
import musicAjax from '../../js/nativeBridge/musicAjax'
import LoadingBlock from '../../component/LoadingBlock';
import ListItemFilter from '../../component/ListItemFilter';
import useScrollRecorder from '../../js/reactHooks/useScrollRecoder';
import { styled } from 'styled-components';

const StyledLocalList = styled(LoadingBlock)`
    height: 100%;
    display: flex;
    flex-direction: column;
    text-align: center;
    overflow: hidden;
`

const StyledMusicListWrapper = styled(LoadingBlock)`
    flex: 1 1;
    overflow: auto;
`

export default function LocalList() {
    const [listData, setListData] = useState([]);
    const [filterList, setFilterList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterloading, setFilterLoading] = useState(true);
    const topBlockRef = useRef();

    useScrollRecorder("LocalList",topBlockRef,!loading);

    var fetchLocalList = useCallback(async () => {
        setLoading(true);
        setFilterLoading(true);
        var ans = await musicAjax.loadLocalListSync();
        setListData(ans);
        setLoading(false);
    },[]);

    var handleFilter = useCallback(list => {
        setFilterList(list);
        setFilterLoading(false);
    },[]);

    //初始载入
    useEffect(() => { fetchLocalList(); },[]);

    return (
        <StyledLocalList $loading={loading} $textHint='refreshing...'>
        { (listData.length)
            ? <>
                <ListItemFilter
                    listData={listData}
                    setFilterList={handleFilter}
                    inputStyle={{height: "1.6em"}}
                />
                <StyledMusicListWrapper $loading={filterloading} $textHint='loading...'>
                    <MusicList innerRef={topBlockRef} listData={filterList}/>
                </StyledMusicListWrapper>
            </>
            : <>
                <p>Nothing in "/sdcard/Music".</p>
                <Button
                    variant='outlined'
                    disableRipple
                    onClick={fetchLocalList}
                    sx={{'&':{alignSelf: 'center'}}}
                >
                    refresh
                </Button>
            </>
        }
        </StyledLocalList>
    )
}
import { Button } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react'
import MusicList from './MusicList'
import musicAjax from '../../js/nativeBridge/musicAjax'
import LoadingBlock from '../../component/LoadingBlock';
import ListItemFilter from '../../component/ListItemFilter';

export default function LocalList() {
    const [listData, setListData] = useState([]);
    const [filterList, setFilterList] = useState([]);
    const [loading, setLoading] = useState(true);

    var fetchLocalList = useCallback(async () => {
        setLoading(true);
        setListData(await musicAjax.loadLocalListSync() || []);
        setTimeout(() => setLoading(false),50);
    },[]);

    //初始载入
    useEffect(() => { fetchLocalList(); },[]);

    return (
        <LoadingBlock loading={loading} style={{height: "100%", textAlign: "center", overflow: "hidden"}}>
            <ListItemFilter
                listData={listData}
                setFilterList={setFilterList}
                inputStyle={{height: "1.6em"}}
                style={{display: (loading || !listData.length) ? "none" : "block"}}/>
            { loading ? (
                <p>refreshing...</p>
            ) : (
                (listData.length) ? (
                    <MusicList listData={filterList} style={{height: "calc(100% - 1.6em)"}}/>
                ) : (
                    <>
                    <p>Nothing in "/sdcard/Music".</p>
                    <Button variant='outlined' disableRipple onClick={fetchLocalList}>refresh</Button>
                    </>
                )
            ) }
        </LoadingBlock>
    )
}
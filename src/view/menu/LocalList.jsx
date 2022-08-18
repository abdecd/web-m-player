import { Button } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react'
import MusicList from './MusicList'
import musicAjax from '../../js/nativeBridge/musicAjax'
import LoadingBlock from '../../component/LoadingBlock';

export default function LocalList() {
    const [listData, setListData] = useState([]);
    const [loading, setLoading] = useState(true);

    var fetchLocalList = useCallback(() => {
        setLoading(true);
        setListData(musicAjax.loadLocalListSync() || [])
        setLoading(false);
    },[]);

    //初始载入
    useEffect(fetchLocalList,[]);

    return (
        <LoadingBlock loading={loading} style={{height: "100%", textAlign: "center", overflow: "hidden"}}>
        { (listData.length==0) ? (
            (loading) ? (
                <p>Refreshing...</p>
            ) : (
                <>
                <p>Nothing.</p>
                <Button variant='outlined' disableRipple onClick={fetchLocalList}>refresh</Button>
                </>
            )
        ) : (
            <MusicList listData={listData}/>
        ) }
        </LoadingBlock>
    )
}

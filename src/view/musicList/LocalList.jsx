import { Button } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react'
import BBasicList from './BBasicList'
import musicAjax from '../../js/musicAjax'

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
        <div style={{height: "100%", transition: "0.2s", opacity: (loading ? 0.35 : 1), textAlign: "center", overflow: "hidden"}}>
        { (listData.length==0) ? (
            (loading) ? (
                <p>Refreshing...</p>
            ) : (
                <>
                <p>Nothing.</p>
                <Button variant='outlined' onClick={fetchLocalList}>refresh</Button>
                </>
            )
        ) : (
            <BBasicList listData={listData}/>
        ) }
        </div>
    )
}

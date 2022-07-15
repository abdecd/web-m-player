import { Button } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react'
import BasicList from './BasicList'
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
        <div style={{transition: "0.2s", opacity: (loading ? 0.35 : 1), textAlign: "center"}}>
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
                <BasicList listData={listData}/>
            ) }
        </div>
    )
}

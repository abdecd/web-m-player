import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '@mui/material/Button';

import BBasicList from "./BasicList"
import style from "../../css/LinearBar.module.css"

import dataCache from "../../js/OnlineListCache";
import musicAjax from '../../js/musicAjax';

export default function OnlineList() {
    //确定list参数
    const listIds = [19723756, 3779629, 2884035];//飙升 新歌 原创
    var { idIndex } = useParams();
    if (!idIndex || isNaN(idIndex) || idIndex<0 || idIndex>2) idIndex = 0;
    var listId = listIds[idIndex];

    var navigate = useNavigate();
    const [listData, setListData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            if (dataCache.id!=listId) {
                setLoading(true);//设置加载效果
                var ans = await musicAjax.fetchDiscover(listId);
                setListData(ans);
                dataCache.id = listId;
                dataCache.data = ans;
            } else {
                setListData(dataCache.data);
            }

            //无论是否需要fetch都关闭效果
            setLoading(false);
        })();
    },[listId]);

    return (
        <div>
            <div className={style.LinearBar}>
                <Button onClick={() => navigate("../onlineList/0")}>飙升</Button>
                <Button onClick={() => navigate("../onlineList/1")}>新歌</Button>
                <Button onClick={() => navigate("../onlineList/2")}>原创</Button>
            </div>
            <div style={{transition: "0.2s", opacity: (loading ? 0.35 : 1)}}>
                <BBasicList listData={listData}/>
            </div>
        </div>
    )
}

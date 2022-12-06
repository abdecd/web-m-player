import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '@mui/material/Button';

import MusicList from "./MusicList"
import style from "../../css/LinearBar.module.css"

import dataCache from "../../js/OnlineListCache";
import musicAjax from '../../js/nativeBridge/musicAjax';
import LoadingBlock from '../../component/LoadingBlock';
import showTips from '../../js/showTips';
import useScrollRecoder from '../../js/reactHooks/useScrollRecoder';

export default function OnlineList() {
    //确定list参数
    const listIds = [19723756, 3779629, 2884035];//飙升 新歌 原创
    var { idIndex } = useParams();
    if (!idIndex || isNaN(idIndex) || idIndex<0 || idIndex>2) idIndex = 0;
    var listId = listIds[idIndex];

    var navigate = useNavigate();
    const [listData, setListData] = useState([]);
    const [loading, setLoading] = useState(true);

    var topBlockRef = useRef();
    useScrollRecoder("OnlineList",topBlockRef,!loading);

    var firstLoad = useRef(true);
    // 重置滚动
    useEffect(() => {
        if (!listData.length) return;
        if (!firstLoad.current) {
            topBlockRef.current.scrollTop = 0;
        } else {
            firstLoad.current = false;
        }
    },[listData]);

    // 获取列表
    useEffect(() => {
        (async () => {
            setLoading(true);//设置加载效果
            if (dataCache.id!=listId) {
                var ans = await musicAjax.fetchDiscover(listId)
                    .catch(e => {showTips.info("获取列表失败，请检查网络设置。"); return []})
                    || [];
                setListData(ans);
                dataCache.id = listId;
                dataCache.data = ans;
            } else {
                setListData(dataCache.data);
            }
            setLoading(false);
        })();
    },[listId]);

    return (
        <div style={{height: "100%"}}>
            <div className={style.LinearBar} style={{height: "25px"}}>
                <Button onClick={() => navigate("../onlineList/0")} style={idIndex==0 ? {color: "#16a091"} : null}>飙升榜</Button>
                <Button onClick={() => navigate("../onlineList/1")} style={idIndex==1 ? {color: "#16a091"} : null}>新歌榜</Button>
                <Button onClick={() => navigate("../onlineList/2")} style={idIndex==2 ? {color: "#16a091"} : null}>原创榜</Button>
            </div>
            <LoadingBlock loading={loading} style={{height: "calc(100% - 25px)", overflow: "auto"}}>
                <MusicList innerRef={topBlockRef} listData={listData} loading={loading}/>
            </LoadingBlock>
        </div>
    )
}

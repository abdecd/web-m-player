import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '@mui/material/Button';

import BasicList from "./BasicList"

import style from "../../css/LinearBar.module.css"

export default function OnlineList() {
    const listIds = [19723756, 3779629, 2884035];//飙升 新歌 原创

    var { idIndex } = useParams();
    if (!idIndex || isNaN(idIndex) || idIndex<0 || idIndex>2) idIndex = 0;
    var listId = listIds[idIndex];

    const [listData, setListData] = useState([]);

    var navigate = useNavigate();

    useEffect(() => {
        (async () => {
            var ans = (await axios("/discover/toplist?id="+listId)).data?.match(/<textarea id="song-list-pre-data" style="display:none;">(.+?)<\/textarea>/)?.[1];
            ans = JSON.parse(ans);

            setListData(ans.map(elem => { return {
                id: elem.id,
                name: elem.name,
                author: elem.artists.map(artist => artist.name).join("、")
            } }));
        })();
    },[listId]);

    return (
        <div>
            <p>OnlineList</p>
            <div className={style.LinearBar}>
                <Button onClick={() => navigate("../onlineList/0")}>飙升</Button>
                <Button onClick={() => navigate("../onlineList/1")}>新歌</Button>
                <Button onClick={() => navigate("../onlineList/2")}>原创</Button>
            </div>
            <BasicList listData={listData}/>
        </div>
    )
}

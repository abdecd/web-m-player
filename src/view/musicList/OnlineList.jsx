import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import List from "./List"

import style from "../../css/OnlineList.module.css"

export default function OnlineList() {
    const listIds = [19723756, 3779629, 2884035];//飙升 新歌 原创

    var { idIndex } = useParams();
    if (!idIndex || isNaN(idIndex) || idIndex<0 || idIndex>2) idIndex = 0;
    var listId = listIds[idIndex];

    const [listData, setListData] = useState([]);

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
    },[]);

    return (
        <div>
            <p>OnlineList</p>
            <List listData={listData}/>
        </div>
    )
}

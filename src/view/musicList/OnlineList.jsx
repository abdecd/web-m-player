import React from 'react'

import style from "../../css/OnlineList.module.css"

export default function OnlineList() {
    const listIds = [19723756, 3779629, 2884035];//飙升 新歌 原创

    var { idIndex } = useParams();
    if (!idIndex || isNaN(idIndex) || idIndex<0 || idIndex>2) idIndex = 0;
    

    return (
        <div>OnlineList</div>
    )
}

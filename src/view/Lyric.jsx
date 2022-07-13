import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

export default function Lyric() {
    var {musicId} = useParams();
    const [lyric, setLyric] = useState("");

    useEffect(() => {
        (async () => {
            var obj = (await axios(`/api/song/lyric?os=pc&id=${musicId}&lv=-1&tv=-1`)).data;
            var lrcGot = obj.lrc.lyric;
            // var lrcGot = obj.tlyric.lyric;
            setLyric(lrcGot.replace(/\n/g,"kkkk"));
        })();
    },[]);

    return (
        <div>
            <p>Lyric</p>
            {lyric}
        </div>
    )
}

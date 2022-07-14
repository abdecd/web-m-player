import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

export default function Lyric() {
    var {musicId} = useParams();
    const [lyric, setLyric] = useState("");
    const [loading, setLoading] = useState(true);

    //fetch lyric
    useEffect(() => {
        (async () => {
            //设置加载效果
            setLoading(true);

            var obj = (await axios(`/api/song/lyric?os=pc&id=${musicId}&lv=-1&tv=-1`)).data;
            var lrcGot = obj.lrc.lyric;
            // var lrcGot = obj.tlyric.lyric;
            setLyric(lrcGot);

            setLoading(false);
        })();
    },[]);

    return (
        <div style={{textAlign: "center", transition: "0.2s", opacity: (loading ? 0.35 : 1)}}>
            { lyric.replace(/\[[^\]]+\]/g,"|&|&|").split("|&|&|").map(elem => <p>{elem}</p>) }
        </div>
    )
}

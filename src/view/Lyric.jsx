import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import musicAjax from '../js/musicAjax';

export default function Lyric() {
    var {musicId} = useParams();
    const [lyric, setLyric] = useState("");
    const [loading, setLoading] = useState(true);

    //fetch lyric
    useEffect(() => {
        (async () => {
            setLoading(true);//设置加载效果
            var lrcGot = await musicAjax.lyric(musicId);
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

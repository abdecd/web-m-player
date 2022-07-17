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
            var lrcGot = await musicAjax.fetchLyric(musicId);
            setLyric(lrcGot);
            setLoading(false);
        })();
    },[]);

    return (
        <div style={{textAlign: "center", transition: "0.2s", opacity: (loading ? 0.35 : 1)}}>
            { lyric?.replace(/\[[^\]]+\]/g,"|&|&|").split("|&|&|").map((elem,index) => elem=="__the_end_of_origional_lyric__" ? <hr key={index+elem}/> : <p key={index+elem}>{elem}</p>) }
        </div>
    )
}

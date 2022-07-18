import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import betterBScroll from '../js/betterBScroll';
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

    var wrapper = useRef();
    useEffect(() => betterBScroll.manage(wrapper.current),[lyric]);

    return (
        <div ref={wrapper} style={{textAlign: "center", transition: "0.2s", opacity: (loading ? 0.35 : 1), height: "100%", overflow: "hidden"}}>
            <div>
            {
                lyric
                    ?.replace(/\[[^\]]+\]/g,"|&|&|")
                    .split("|&|&|")
                    .map((elem,index) => (
                        elem=="__the_end_of_origional_lyric__" ? 
                            <div key={index+elem} style={{width: "100%", height: "0px", border: "1px solid gray"}}/>
                            : <p key={index+elem}>{elem}</p>
                    ))
            }
            </div>
        </div>
    )
}

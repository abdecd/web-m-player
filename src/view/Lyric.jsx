import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import musicAjax from '../js/nativeBridge/musicAjax';
import webMusicManager from '../js/webMusicManager';

export default function Lyric() {
    var {musicId} = useParams();
    const [lyric, setLyric] = useState("");
    const [loading, setLoading] = useState(true);

    var navigate = useNavigate();

    //fetch lyric
    var lyricElem = useRef();
    useEffect(() => {
        (async () => {
            setLoading(true);//设置加载效果
            var lrcGot = await musicAjax.fetchLyric(musicId);
            setLyric(lrcGot);
            lyricElem.current.scrollTop = 0;
            setLoading(false);
        })();
    },[musicId]);

    //订阅歌曲变化
    var getMusicId = useCallback(async musicName => (await musicAjax.fetchSearch(musicName))?.[0].id,[]);
    useEffect(() => {
        var refreshId = async () => {
            if (!webMusicManager.name) return;
            if (!webMusicManager.id) webMusicManager.id = await getMusicId(webMusicManager.name);
            navigate("../lyric/"+webMusicManager.id);
        };
        webMusicManager.handler.addEventListener("loadstart",refreshId);
        return () => webMusicManager.handler.removeEventListener("loadstart",refreshId);
    },[]);

    return (
        <div ref={lyricElem} style={{textAlign: "center", transition: "0.2s", opacity: (loading ? 0.35 : 1), height: "100%", overflow: "auto"}}>
        {
            lyric
                ?.split("\n")
                .map((elem,index) => (
                    elem=="__the_end_of_origional_lyric__" ? 
                        <div key={index+elem} style={{width: "100%", height: "0px", border: "1px solid gray"}}/>
                        : <p key={index+elem}>{elem}</p>
                ))
        }
        </div>
    )
}

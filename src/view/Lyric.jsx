import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import musicAjax from '../js/musicAjax';
import WebMusicManager from '../js/WebMusicManager';

export default function Lyric() {
    var {musicId} = useParams();
    const [lyric, setLyric] = useState("");
    const [loading, setLoading] = useState(true);

    var navigate = useNavigate();

    //fetch lyric
    useEffect(() => {
        (async () => {
            setLoading(true);//设置加载效果
            var lrcGot = await musicAjax.fetchLyric(musicId);
            setLyric(lrcGot);
            setLoading(false);
        })();
    },[musicId]);

    //订阅歌曲变化
    var getMusicId = useCallback(async musicName => (await musicAjax.fetchSearch(musicName))?.[0].id,[]);
    useEffect(() => {
        var refreshId = async () => {
            console.log("really?!");
            if (!WebMusicManager.name) return;
            if (!WebMusicManager.id) {
                var name = WebMusicManager.name;
                if (name.match(/ - /).length) name = name.replace(/^[^-]+- /,"");
                WebMusicManager.id = await getMusicId(name);
            }
            navigate("../lyric/"+WebMusicManager.id);
        };
        WebMusicManager.handler.addEventListener("loadstart",refreshId);
        return () => WebMusicManager.handler.removeEventListener("loadstart",refreshId);
    },[]);

    return (
        <div style={{textAlign: "center", transition: "0.2s", opacity: (loading ? 0.35 : 1), height: "100%", overflow: "auto"}}>
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

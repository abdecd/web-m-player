import BScroll from '@better-scroll/core';
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import LoadingBlock from '../component/LoadingBlock';
import musicAjax from '../js/nativeBridge/musicAjax';
import showTips from '../js/showTips';
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
            var lrcGot = await musicAjax.fetchLyric(musicId).catch(e => {showTips.info("获取歌词失败。"); throw e});
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
            if (!webMusicManager.id) webMusicManager.id = await getMusicId(webMusicManager.name).catch(e => {showTips.info("获取歌曲对应id失败，无法获取歌词。"); throw e});
            navigate("../lyric/"+webMusicManager.id);
        };
        webMusicManager.handler.addEventListener("loadstart",refreshId);
        return () => webMusicManager.handler.removeEventListener("loadstart",refreshId);
    },[]);

    var bScrollStorage = useRef();

    useEffect(() => { bScrollStorage.current = new BScroll(lyricElem.current); },[]);
    useEffect(() => { bScrollStorage.current.refresh(); },[lyric]);

    return (
        <LoadingBlock innerRef={lyricElem} loading={loading} style={{textAlign: "center", height: "100%", overflow: "hidden"}}>
            <div>
            {
                lyric?.trim().split("\n").map((elem,index) => <p key={index+elem}>{elem}</p>)
            }
            </div>
        </LoadingBlock>
    )
}

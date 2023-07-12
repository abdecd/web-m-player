import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import LoadingBlock from '../component/LoadingBlock';
import musicAjax from '../js/nativeBridge/musicAjax';
import useScrollRecoder, { setRecord } from '../js/reactHooks/useScrollRecoder';
import showTips from '../js/showTips';
import webMusicManager from '../js/webMusicManager';

// 重置滚动记录
webMusicManager.musicNameChangeSub.subscribe(() => setRecord("Lyric",0));

export default function Lyric() {
    var {musicId} = useParams();
    const [lyric, setLyric] = useState("");
    const [loading, setLoading] = useState(true);

    var navigate = useNavigate();

    var lyricElem = useRef();
    var firstLoad = useRef(true);
    useScrollRecoder("Lyric",lyricElem,!loading);

    // 重置滚动
    useEffect(() => {
        if (!lyric) return;
        if (!firstLoad.current) {
            lyricElem.current.scrollTop = 0;
        } else {
            // 排除第一次载入歌词
            firstLoad.current = false;
        }
    },[lyric]);

    //fetch lyric
    useEffect(() => {
        (async () => {
            setLoading(true);//设置加载效果
            var lrcGot = await musicAjax.fetchLyric(musicId).catch(e => {showTips.info("获取歌词失败。"); throw e});
            setLyric(lrcGot);
            setLoading(false);
        })();
    },[musicId]);

    //订阅歌曲变化
    useEffect(() => {
        var getMusicId = async musicName => (await musicAjax.fetchSearch(musicName))?.[0].id;
        var refreshId = async () => {
            if (!webMusicManager.name) return;
            if (!webMusicManager.id) webMusicManager.musicObj.id = await getMusicId(webMusicManager.name).catch(e => {showTips.info("获取歌曲对应id失败，无法获取歌词。"); throw e});
            navigate("../lyric/"+webMusicManager.musicObj.id);
        };//仅变化时执行
        webMusicManager.handler.addEventListener("loadstart",refreshId);
        return () => webMusicManager.handler.removeEventListener("loadstart",refreshId);
    },[]);

    return (
        // 留MusicBar位置
        <LoadingBlock innerRef={lyricElem} loading={loading} style={{textAlign: "center", height: "100%", paddingBottom: "60px", overflow: "auto"}}>
            <div>
            {
                lyric?.trim().split("\n").map((elem,index) => <p key={index+elem}>{elem}</p>)
            }
            </div>
        </LoadingBlock>
    )
}

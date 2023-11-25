import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import LoadingBlock from '../component/LoadingBlock';
import musicAjax from '../js/nativeBridge/musicAjax';
import useScrollRecoder, { setRecord } from '../js/reactHooks/useScrollRecoder';
import showTips from '../js/showTips';
import webMusicManager from '../js/webMusicManager';
import { useTheme } from '@mui/material';

// 重置滚动记录
webMusicManager.musicNameChangeSub.subscribe(() => setRecord("Lyric",0));

export default function Lyric() {
    var {musicId} = useParams();
    const [lyric, setLyric] = useState(null);
    const [highlightIndex, setHighlightIndex] = useState(-1);
    const [loading, setLoading] = useState(true);

    var navigate = useNavigate();

    var lyricElem = useRef();
    var firstLoad = useRef(true);
    useScrollRecoder("Lyric",lyricElem,!loading);

    // 歌词更换时重置滚动
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

    //订阅时间变化
    useEffect(() => {
        var keys = Array.from(lyric?.keys()||[]);
        function getIndex() {
            var curr = webMusicManager.getCurrentTime();
            var start = 0, end = keys.length;
            while (start<end) {
                var mid = Math.floor((start+end)/2);
                if (keys[mid]>curr) end = mid;
                else start = mid+1;
            }
            return end-1;
        }
        var td = setInterval(() => {
            setHighlightIndex(getIndex());
        },500);
        return () => clearInterval(td);
    },[lyric]);

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

    var theme = useTheme();

    return (
        // 留MusicBar位置
        <LoadingBlock innerRef={lyricElem} loading={loading} style={{textAlign: "center", height: "100%", paddingBottom: "60px", overflow: "auto"}}>
            <div style={{fontSize: "1.25em", margin: "16px"}}>{webMusicManager.name}</div>
            <div>
            {
                Array.from(lyric?.values()||[]).map((elem,index) => (
                    <div key={index+elem} style={{transition: "0.25s",...(index==highlightIndex?{color: theme.palette.primary["dark"]}:{})}}>{
                        elem.split("\n").map(x=><p key={index+x}>{x}</p>)
                    }</div>
                ))
            }
            </div>
        </LoadingBlock>
    )
}

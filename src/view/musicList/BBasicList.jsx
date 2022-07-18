import React, { useCallback } from 'react'

import BasicList from '../../component/BasicList';
import WebMusicManager from '../../js/WebMusicManager';
import musicAjax from '../../js/musicAjax';
import showTips from '../../js/showTips';

export default function BBasicList({listData,loading=false}) {
    //listData <==> [{ id or url, name, author },...]

    var playMusic = useCallback(async (ev,elem) => {
        if (await WebMusicManager.load(elem.name, elem.id || null, elem.url || await musicAjax.fetchSrc(elem.id))) {
            WebMusicManager.play();
        } else {
            showTips.info("载入失败");
        }
    },[]);

    var addMusic = useCallback(async (ev,elem) => {
        if (!WebMusicManager.push(elem.name, elem.id || null, elem.url || await musicAjax.fetchSrc(elem.id)))
            showTips.info("添加至播放列表失败");
    },[]);

    var addAllMusic = useCallback(async () => {
        for (var elem of listData) await WebMusicManager.push(elem.name, elem.id || null, elem.url || await musicAjax.fetchSrc(elem.id));
        showTips.info("已全部添加至播放列表。");
    },[listData]);

    return <div style={{height: "100%", overflow: "auto"}}>
        {(listData.length==0 && loading) ? (
            <p style={{textAlign: "center"}}>refreshing...</p>
        ) : (
            <BasicList
                listData={listData.map(elem => {return {name: elem.name, subName: elem.author, key: elem.id||elem.url, /*私货*/id: elem.id, url: elem.url}})}
                btnText="+"
                itemClickFn={playMusic}
                btnClickFn={addMusic}
                btnLongClickFn={addAllMusic}/>
        )}
    </div>
}

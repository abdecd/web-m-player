import React, { useCallback } from 'react'

import BasicList from '../../component/BasicList';
import WebMusicManager from '../../js/WebMusicManager';
import showTips from '../../js/showTips';

export default function BBasicList({listData,loading=false}) {
    //listData <==> [{ id or url, name, author },...]

    var playMusic = useCallback(async (ev,elem) => {
        if (await WebMusicManager.load(elem.name, elem.url, elem.id)) {
            WebMusicManager.play();
        } else {
            showTips.info("载入失败。");
        }
    },[]);

    var addMusic = useCallback((ev,elem) => {
        switch (WebMusicManager.push(elem.name, elem.url, elem.id)) {
            case WebMusicManager.PUSH_STATE.SUCCESS:
                return ;//showTips.info("添加至播放列表成功。");
            case WebMusicManager.PUSH_STATE.EXISTS:
                return showTips.info("该项目已存在。");
            case WebMusicManager.PUSH_STATE.FAILED:
                return showTips.info("添加至播放列表失败。");
        }
    },[]);

    var addAllMusic = useCallback(() => {
        var successCnt = 0, existsCnt = 0, failCnt = 0;
        for (var elem of listData) {
            var statue = WebMusicManager.push(elem.name, elem.url, elem.id);
            if (statue==WebMusicManager.PUSH_STATE.SUCCESS) {
                successCnt++;
            } else if (statue==WebMusicManager.PUSH_STATE.EXISTS) {
                existsCnt++;
            } else if (statue==WebMusicManager.PUSH_STATE.FAILED) {
                failCnt++;
            }
        }

        var strs = [];
        strs.push(`${successCnt}项已成功添加至播放列表`);
        if (existsCnt) strs.push(`${existsCnt}项已存在`);
        if (failCnt) strs.push(`${failCnt}项失败`);
        showTips.info(strs.join("，")+"。");
    },[listData]);

    return <>
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
    </>
}

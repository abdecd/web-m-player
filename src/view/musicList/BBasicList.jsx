import React, { useCallback } from 'react'

import BasicList from '../../component/BasicList';
import WebMusicManager from '../../js/WebMusicManager';
import showTips from '../../js/showTips';
import WebMusicList from '../../js/WebMusicList';

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
                return showTips.info("添加至播放列表成功。");
            case WebMusicManager.PUSH_STATE.SWAP:
                return showTips.info("项目存在，已移至列表末。");
            case WebMusicManager.PUSH_STATE.FAIL:
                return showTips.info("添加至播放列表失败。");
        }
    },[]);

    var addAllMusic = useCallback(() => {
        var failCnt = 0;
        for (var elem of listData) if (!WebMusicManager.push(elem.name, elem.url, elem.id)) failCnt++;

        if (!failCnt) {
            showTips.info(`${listData.length}项已全部添加至播放列表。`);
        } else {
            showTips.info(`${listData.length-failCnt}项已全部添加至播放列表，${failCnt}项失败。`);
        }
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

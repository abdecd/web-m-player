import React, { useCallback } from 'react'

import BasicList from '../../component/BasicList';
import webMusicManager from '../../js/webMusicManager';
import showTips from '../../js/showTips';
import useUndoableMusicList from '../../js/useUndoableMusicList';

export default function MusicList({listData,loading=false}) {
    //listData <==> [{ id or url, name, author },...]
    var undoSpecificListFn = useUndoableMusicList();

    var playMusic = useCallback(async (ev,elem) => {
        if (await webMusicManager.load(elem.name, elem.url, elem.id)) webMusicManager.play();
    },[]);

    var addMusic = useCallback((ev,elem) => {
        switch (webMusicManager.push(elem.name, elem.url, elem.id)) {
            case webMusicManager.PUSH_STATE.SUCCESS:
                return showTips.info("添加至播放列表成功。",undoSpecificListFn);
            case webMusicManager.PUSH_STATE.EXISTS:
                return showTips.info("该项目已存在。");
            case webMusicManager.PUSH_STATE.FAILED:
                return showTips.info("添加至播放列表失败。");
        }
    },[]);

    var addAllMusic = useCallback(() => {
        var { successCnt, existsCnt, failCnt } = webMusicManager.pushAll(listData);

        var strs = [];
        strs.push(`${successCnt}项成功添加至播放列表`);
        if (existsCnt) strs.push(`${existsCnt}项已存在`);
        if (failCnt) strs.push(`${failCnt}项失败`);
        showTips.info(strs.join("，")+"。",undoSpecificListFn);//todo: pushAll
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

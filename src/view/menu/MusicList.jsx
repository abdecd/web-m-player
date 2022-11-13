import React, { useCallback } from 'react'

import BasicList from '../../component/BasicList';
import webMusicManager from '../../js/webMusicManager';
import showTips from '../../js/showTips';
import undoFnContainer from '../../js/supportUndoMusicList';
import { ListItem } from '@mui/material';
import { LeftItem, RightBtn } from '../../component/ListButton';

export default function MusicList({listData,loading=false,style}) {
    //listData <==> [{ id or url, name, author },...]
    var undoSpecificListFn = undoFnContainer.value;

    var playMusic = useCallback(async (ev,elem) => {
        if (await webMusicManager.load(elem.name, elem.url, elem.id)) webMusicManager.play();
    },[]);

    var addAheadMusic = useCallback((ev,elem) => {
        webMusicManager.aheadList.push(elem);
        showTips.info("已加入“即将播放”。",() => webMusicManager.aheadList.pop());
    },[]);

    var addMusicToIndexNext = useCallback((ev,elem) => {
        if (addMusic(ev,elem)!=webMusicManager.PUSH_STATE.SUCCESS) return;
        if (webMusicManager.list.mvToIndexNext(webMusicManager.list.length-1)) {
            showTips.info("已添加至当前播放位置的下一个。");
        } else {
            showTips.info("添加至当前播放位置的下一个失败。");
        }
    })

    var addMusic = useCallback((ev,elem) => {
        switch (webMusicManager.push(elem.name, elem.url, elem.id)) {
            case webMusicManager.PUSH_STATE.SUCCESS:
                showTips.info("添加至播放列表成功。",undoSpecificListFn);
                return webMusicManager.PUSH_STATE.SUCCESS;
            case webMusicManager.PUSH_STATE.EXISTS:
                showTips.info("该项目已存在。");
                return webMusicManager.PUSH_STATE.EXISTS;
            case webMusicManager.PUSH_STATE.FAILED:
                showTips.info("添加至播放列表失败。");
                return webMusicManager.PUSH_STATE.FAILED;
        }
    },[]);

    var addAllMusic = useCallback(() => {
        var { successCnt, existsCnt, failCnt } = webMusicManager.pushAll(listData.map(elem => ({ name: elem.name, src: elem.url, id: elem.id })));

        var strs = [];
        strs.push(`${successCnt}项成功添加至播放列表`);
        if (existsCnt) strs.push(`${existsCnt}项已存在`);
        if (failCnt) strs.push(`${failCnt}项失败`);
        showTips.info(strs.join("，")+"。",undoSpecificListFn);
    },[listData]);

    return <>
        {(listData.length==0 && loading) ? (
            <p style={{textAlign: "center"}}>refreshing...</p>
        ) : (
            <BasicList style={style}>
            {
                listData
                .map(elem => ({name: elem.name, subName: elem.author, key: elem.id||elem.url, /*私货*/id: elem.id, url: elem.url}))
                .map(elem => (
                    <ListItem key={elem.key}>
                        <LeftItem name={elem.name} subName={elem.subName} clickFn={ev=>playMusic(ev,elem)}></LeftItem>
                        <RightBtn btnText="=>" clickFn={ev=>addAheadMusic(ev,elem)} longClickFn={ev=>addMusicToIndexNext(ev,elem)}></RightBtn>
                        <RightBtn btnText="+" clickFn={ev=>addMusic(ev,elem)} longClickFn={ev=>addAllMusic(ev,elem)}></RightBtn>
                    </ListItem>
                ))
            }
            </BasicList>
        )}
    </>
}
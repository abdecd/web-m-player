import React, { useCallback, useMemo } from 'react'

import BasicList from '../../component/BasicList';
import webMusicManager from '../../js/webMusicManager';
import showTips from '../../js/showTips';
import undoFnContainer from '../../js/reactHooks/supportUndoMusicList';
import { ListItem } from '@mui/material';
import { LeftItem, RightBtn } from '../../component/ListButton';

export default function MusicList({listData,loading=false,style,innerRef}) {
    //listData <==> [{ id or url, name, author },...]
    // 添加fullName属性
    var editedListData = useMemo(() => listData.map(elem=>({...elem, fullName: elem.author ? (`${elem.author} - ${elem.name}`) : elem.name})),[listData]);

    var undoSpecificListFn = undoFnContainer.value;

    var playMusic = useCallback(async (ev,elem) => {
        if (await webMusicManager.nextByObj(elem)) webMusicManager.play();
    },[]);

    var addAheadMusic = useCallback((ev,elem) => {
        webMusicManager.pushAhead(elem.name,elem.src,elem.id);
        showTips.info("已加入“即将播放”。",() => webMusicManager.aheadList.pop());
    },[]);

    var addAllToAheadList = useCallback(() => {
        var filterList = editedListData.map(elem => ({name: elem.fullName, id: elem.id, src: elem.url}));
        var oldList = webMusicManager.aheadList;
        webMusicManager.aheadList = webMusicManager.aheadList.concat(filterList);
        showTips.info(filterList.length+"项已加入“即将播放”。",() => webMusicManager.aheadList = oldList);
    },[editedListData]);

    var addMusic = useCallback((ev,elem) => {
        switch (webMusicManager.push(elem.name, elem.src, elem.id)) {
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
        var { successCnt, existsCnt, failCnt } = webMusicManager.pushAll(editedListData.map(elem => ({ name: elem.fullName, src: elem.url, id: elem.id })));

        var strs = [];
        strs.push(`${successCnt}项成功添加至播放列表`);
        if (existsCnt) strs.push(`${existsCnt}项已存在`);
        if (failCnt) strs.push(`${failCnt}项失败`);
        showTips.info(strs.join("，")+"。",undoSpecificListFn);
    },[editedListData]);

    return <>
        {(editedListData.length==0 && loading) ? (
            <p style={{textAlign: "center"}}>refreshing...</p>
        ) : (
            // 留MusicBar位置
            <BasicList innerRef={innerRef} style={{ paddingBottom: 'calc(var(--musicbar-height) + 10px)', ...style}}>
            {
                editedListData
                .map(elem => ({
                    firstName: elem.name,
                    subName: elem.author,
                    key: elem.id||elem.url,
                    /*私货*/
                    name: elem.fullName,
                    id: elem.id,
                    src: elem.url
                }))
                .map(elem => (
                    <ListItem key={elem.key}>
                        <LeftItem
                            name={elem.firstName}
                            subName={elem.subName}
                            tags={/^(content|file)/.test(elem.src)?[]:["online"]}
                            clickFn={ev=>playMusic(ev,elem)}/>
                        <RightBtn
                            btnText={<svg style={{width: "1em",height: "1em",verticalAlign: "middle",fill: "currentColor",overflow: "hidden"}} viewBox="0 0 1000 1000" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15104"><path d="M362.57 764.226h364.149c28.44 0 51.491-23.051 51.491-51.491v-364.149c0-28.44-23.051-51.491-51.491-51.491s-51.491 23.051-51.491 51.491v239.829l-349.073-349.073c-20.119-20.119-52.711-20.119-72.831 0s-20.119 52.711 0 72.831l349.073 349.073h-239.829c-14.202-0.001-27.093 5.754-36.415 15.076s-15.094 22.195-15.076 36.415c0 28.44 23.051 51.491 51.491 51.491z" p-id="15105"></path></svg>}
                            clickFn={ev=>addAheadMusic(ev,elem)}
                            longClickFn={ev=>addAllToAheadList()}/>
                        <RightBtn btnText="+" clickFn={ev=>addMusic(ev,elem)} longClickFn={ev=>addAllMusic(ev,elem)}></RightBtn>
                    </ListItem>
                ))
            }
            </BasicList>
        )}
    </>
}
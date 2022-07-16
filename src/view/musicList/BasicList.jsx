import React, { useCallback } from 'react'

import BBasicList from '../../component/BasicList';
import WebMusicManager from '../../js/WebMusicManager';
import musicAjax from '../../js/musicAjax';

export default function BasicList({listData}) {
    //listData <==> [{ id or url, name, author },...]

    var playMusic = useCallback(async elem => {
        if (await WebMusicManager.load(elem.name, elem.id || null, elem.url || await musicAjax.fetchSrc(elem.id))) {
            WebMusicManager.play();
        } else {
            console.info("载入失败");
        }
    },[]);

    var addMusic = useCallback(async elem => {
        if (!WebMusicManager.push(elem.name, elem.id || null, elem.url || await musicAjax.fetchSrc(elem.id)))
            console.info("添加至播放列表失败");
    },[]);

    return <BBasicList
        listData={listData.map(elem => {return {name: elem.name, subName: elem.author, id: elem.id||elem.url}})}
        btnText="+"
        itemClickFn={playMusic}
        btnClickFn={addMusic}/>
}

import { useCallback } from "react";
import ListNameListPopup from "../../component/ListnameListPopup";
import showTips from "../../js/showTips";
import WebMusicList from "../../js/WebMusicList";
import webMusicListStorage from "../../js/webMusicListStorage";

export default function MusicCopyPopup({shown,setShown,musicObjs}) {
    var copyToList = useCallback(listName => {
        var storeObj = webMusicListStorage.get(listName);
        var list = new WebMusicList(listName,storeObj,true);
        return list.pushSomeElem(musicObjs);
    },[musicObjs]);

    return <ListNameListPopup
        shown={shown}
        setShown={setShown}
        titleBlock={<p style={{paddingLeft: "20px"}}>将{musicObjs.length}项复制到：</p>}
        onItemClick={name => {
            var {successCnt, existsCnt, failCnt} =  copyToList(name);

            var strs = [];
            strs.push(`${successCnt}项复制成功`);
            if (existsCnt) strs.push(`${existsCnt}项已存在`);
            if (failCnt) strs.push(`${failCnt}项失败`);
            showTips.info(strs.join("，")+"。");

            setShown(false);
        }}/>
}
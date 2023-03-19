import { List } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import BehindRoot from "../../component/BehindRoot";
import { LeftItem } from "../../component/ListButton";
import useRenderTimeRemainer from "../../js/reactHooks/useRenderTimeRemainer";
import showTips from "../../js/showTips";
import WebMusicList from "../../js/WebMusicList";
import webMusicListStorage from "../../js/webMusicListStorage";

export default function MusicCopyPopup({shown,setShown,musicObjs}) {
    const [nameList, setNameList] = useState([]);
    
    //订阅nameList
    useEffect(() => {
        var refreshFn = names => setNameList(names.map(elem => ({name: elem, key: elem})));
        refreshFn(webMusicListStorage.names);
        webMusicListStorage.addNamesChangeListener(refreshFn);
        return () => webMusicListStorage.removeNamesChangeListener(refreshFn);
    },[]);
    
    var copyToList = useCallback(listName => {
        var storeObj = webMusicListStorage.get(listName);
        var list = new WebMusicList(listName,storeObj,true);
        return list.pushSomeElem(musicObjs);
    },[musicObjs]);
    
    const delayTime = 200;
    var { exist, shouldRender } = useRenderTimeRemainer(shown,delayTime);
    const zIndex = 2;
    var divStyle = {
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%,-50%)",
        zIndex,

        width: "60vw",
        height: "80vh",
        borderRadius: "5px",
        backdropFilter: "blur(6px) brightness(1.2)",
        boxShadow: "0px 0px 20px 0px rgba(0,0,0,0.2)",

        opacity: shouldRender ? 1 : 0,
        transition: delayTime/1000+"s",
    };
    var maskStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.2)",
        opacity: (shouldRender ? 1 : 0),
        transition: delayTime/1000+"s",
        zIndex
    };

    return <BehindRoot>{exist && <>
        <div style={maskStyle} onClick={() => setShown(false)}/>
        <div style={divStyle}>
            <p style={{paddingLeft: "20px"}}>将{musicObjs.length}项复制到：</p>
            <List style={{overflow: "auto"}}>
            {
                nameList.map(x =>
                    <LeftItem
                        name={x.name}
                        key={x.key}
                        clickFn={() => {
                            var {successCnt, existsCnt, failCnt} =  copyToList(x.name);

                            var strs = [];
                            strs.push(`${successCnt}项成功复制`);
                            if (existsCnt) strs.push(`${existsCnt}项已存在`);
                            if (failCnt) strs.push(`${failCnt}项失败`);
                            showTips.info(strs.join("，")+"。");

                            setShown(false);
                        }}/>
                )
            }
            </List>
        </div>
    </>}</BehindRoot>
}
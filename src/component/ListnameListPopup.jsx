import { List } from "@mui/material";
import { useEffect, useState } from "react";
import BehindRoot from "../component/BehindRoot";
import useRenderTimeRemainer from "../js/reactHooks/useRenderTimeRemainer";
import webMusicListStorage from "../js/webMusicListStorage";
import { LeftItem } from "./ListButton";

export default function ListnameListPopup({shown,setShown,titleBlock,onItemClick}) {
    const [nameList, setNameList] = useState([]);
    
    //订阅nameList
    useEffect(() => {
        var refreshFn = names => setNameList(names.map(elem => ({name: elem, key: elem})));
        refreshFn(webMusicListStorage.names);
        webMusicListStorage.addNamesChangeListener(refreshFn);
        return () => webMusicListStorage.removeNamesChangeListener(refreshFn);
    },[]);
    
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
        display: "flex",
        flexDirection: "column",

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
            {titleBlock}
            <List style={{ flex: "1 1 0", overflow: "auto" }}>
            { nameList.map(x =>
                <LeftItem
                    name={x.name}
                    key={x.key}
                    clickFn={() => onItemClick(x.name)}/>
            ) }
            </List>
        </div>
    </>}</BehindRoot>
}
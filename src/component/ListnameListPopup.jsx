import { List } from "@mui/material";
import { useEffect, useState } from "react";
import BehindRoot from "../component/BehindRoot";
import useRenderTimeRemainer from "../js/reactHooks/useRenderTimeRemainer";
import webMusicListStorage from "../js/webMusicListStorage";
import { LeftItem } from "./ListButton";
import { styled } from "styled-components";

const CenterBlock = styled.div`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    width: 80vw;
    height: 70vh;
    border-radius: 5px;
`

const StyledPopup = styled(CenterBlock)`
    opacity: ${p=>p.$opacity};
    transition: ${p=>p.$delayTime/1000}s;
    z-index: ${p=>p.$zIndex};
    box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.5);
    display: flex;
    flex-direction: column;
    padding-bottom: 16px;
`

const StyledBg = styled(CenterBlock)`
    z-index: ${p=>p.$zIndex};
    opacity: ${p=>p.$opacity};
    transition: ${p=>p.$delayTime/1000}s;
    backdrop-filter: blur(12px) brightness(2);
    -webkit-backdrop-filter: blur(12px) brightness(2);
`

const Mask = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.5);
    z-index: ${p=>p.$zIndex};
    opacity: ${p=>p.$opacity};
    transition: ${p=>p.$delayTime/1000}s;
`

export default function ListnameListPopup({shown,setShown,titleBlock,onItemClick}) {
    const [nameList, setNameList] = useState([]);
    const delayTime = 300;
    var { exist, shouldRender } = useRenderTimeRemainer(shown,delayTime);
    
    //订阅nameList
    useEffect(() => {
        if (exist) setNameList(webMusicListStorage.names.map(elem => ({name: elem, key: elem})));
    },[exist]);
    
    const zIndex = 2;

    return <BehindRoot>{exist && <>
        <Mask
            $zIndex={zIndex}
            $opacity={shouldRender ? 1 : 0}
            $delayTime={delayTime}
            onClick={() => setShown(false)}/>
        <StyledBg
            $zIndex={zIndex}
            $opacity={shouldRender ? 1 : 0}
            $delayTime={delayTime}/>
        <StyledPopup
            $zIndex={zIndex}
            $opacity={shouldRender ? 1 : 0}
            $delayTime={delayTime}
        >
            {titleBlock}
            <List style={{ flex: "1 1 0", overflow: "auto" }}>
            { nameList.map(x =>
                <LeftItem
                    name={x.name}
                    key={x.key}
                    clickFn={() => onItemClick(x.name)}/>
            ) }
            </List>
        </StyledPopup>
    </>}</BehindRoot>
}
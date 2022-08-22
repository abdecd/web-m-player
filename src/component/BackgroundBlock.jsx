import React, { useEffect, useState } from 'react'
import settings from '../js/settings';
import LoadingBlock from './LoadingBlock'

var maskCss = {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    zIndex: "-1",
};

var backgroundImgCss = {
    width: "auto",
    minWidth: "100vw",
    height: "100vh",
    position: "relative",
    left: "50%",
    transform: "translateX(-50%)"
};

export default function BackgroundBlock({style}) {
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState("image");
    const [src, setSrc] = useState("");

    useEffect(() => {
        var handleBackground = (newType,url) => {
            setLoading(true);
            setTimeout(() => {
                setType(newType);
                setSrc(url);
            },400);
        };
        settings.backgroundSub.add(handleBackground);
        return () => settings.backgroundSub.remove(handleBackground);
    },[]);

    return (
        <div style={{ ...maskCss, ...style }}>
            {
            type!="basic" && 
            <LoadingBlock
                loading={loading}
                opacityMin={0}
                style={{transition: "0.4s"}}>
                {type=="image" ? (
                    <img src={src} onLoad={() => setLoading(false)} style={backgroundImgCss}/>
                ) : (
                    <video src={src} onCanPlay={() => setLoading(false)} autoPlay loop muted style={backgroundImgCss}/>
                )}
            </LoadingBlock>
            }
        </div>
    )
}
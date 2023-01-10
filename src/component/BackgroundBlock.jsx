import React, { useEffect, useRef, useState } from 'react'
import LoadingBlock from './LoadingBlock'

var maskCss = {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    zIndex: "-2",
};

var backgroundImgCss = {
    width: "100vw",
    height: "100vh",
    objectFit: "cover",
    objectPosition: "center center"
};

export default React.memo(function BackgroundBlock({ style, type: prop_type, src: prop_src }) {
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState(prop_type);
    const [src, setSrc] = useState(prop_src);
    const video = useRef();

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setType(prop_type);
            setSrc(prop_src);
        },400);
    },[prop_type,prop_src]);

    useEffect(() => {
        var pauseFn=() => {
            if (!video.current) return;
            if (document.hidden) video.current.pause();
            else video.current.play();
        };
        document.addEventListener("visibilitychange",pauseFn);
        () => document.removeEventListener("visibilitychange",pauseFn);
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
                    <video ref={video} src={src} onCanPlay={() => setLoading(false)} autoPlay loop muted style={backgroundImgCss}/>
                )}
            </LoadingBlock>
            }
        </div>
    )
})
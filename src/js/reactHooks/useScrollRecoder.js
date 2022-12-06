import { useEffect, useRef } from "react";

var scrollTops={};

export default function useScrollRecorder(name,elemRef,canScroll=true) {
    var scrollTop = useRef(0);
    var firstLoad = useRef(true);

    useEffect(() => {
        scrollTop.current = scrollTops[name] || elemRef.current?.scrollTop;
        return () => scrollTops[name] = scrollTop.current;
    },[]);

    useEffect(() => {
        if (firstLoad.current && canScroll) {
            firstLoad.current = false;
            if (elemRef.current) elemRef.current.scrollTop = scrollTop.current;
        }
    },[canScroll]);

    // 记录滚动位置
    useEffect(() => {
        var handler = ev => scrollTop.current = ev.target.scrollTop;
        elemRef.current?.addEventListener("scroll",handler);
        return () => elemRef.current?.removeEventListener("scroll",handler);
    },[canScroll]);
}
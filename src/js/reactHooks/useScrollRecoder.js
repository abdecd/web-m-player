import { useEffect, useRef } from "react";

var scrollTops={};

function setRecord(name,num) { scrollTops[name]=num }
function useScrollRecorder(name,elemRef,canScroll=true) {
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
        var td;
        var handler = ev => {
            clearTimeout(td);
            td = setTimeout(() => scrollTop.current = ev.target.scrollTop, 200);
        };
        elemRef.current?.addEventListener("scroll",handler,{passive: true});
        return () => elemRef.current?.removeEventListener("scroll",handler);
    },[canScroll]);
}

export {
    useScrollRecorder as default,
    setRecord
};
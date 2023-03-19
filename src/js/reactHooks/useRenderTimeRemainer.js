import { useLayoutEffect, useState } from "react";

export default function useRenderTimeRemainer(shown,delayTime) {
    const [exist, setExist] = useState(shown);
    const [shouldRender, setShouldRender] = useState(shown);
    useLayoutEffect(() => {
        if (shown) {
            setExist(true);
            setTimeout(() => setShouldRender(true),0);
        } else {
            setShouldRender(false);
            setTimeout(() => setExist(false),delayTime);
        }
    },[shown,delayTime]);

    return { exist, shouldRender };
}
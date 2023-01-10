import { useEffect, useRef } from "react";

function useStateReferrer(aState) {
    const referrer = useRef(aState);
    useEffect(() => { referrer.current = aState; },[aState]);

    return referrer;
}

export default useStateReferrer;
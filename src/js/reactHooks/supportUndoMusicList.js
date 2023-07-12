import { useRef, useEffect, useCallback } from 'react';
import webMusicManager from '../webMusicManager';

function useUndoableMusicList() {
    const specificList = useRef(webMusicManager.list.cloneWithNoStorage());
    const oldSpecificList = useRef(webMusicManager.list.cloneWithNoStorage());

    //订阅specificList
    useEffect(() => {
        var refreshFn = () => {
            oldSpecificList.current = specificList.current;
            var newCloneList = webMusicManager.list.cloneWithNoStorage();
            specificList.current = newCloneList;
        };
        var revoker = ()=>{};
        var listChangeHandler = () => {
            revoker();
            refreshFn();
            revoker = webMusicManager.list.changeSub.subscribe(refreshFn);
        };
        listChangeHandler();
        return webMusicManager.listChangeSub.subscribe(listChangeHandler);
    },[]);

    //撤销specificList函数
    var undoSpecificListFn = useCallback(() => {
        var oldList = oldSpecificList.current.cloneWithNoStorage();
        oldList.setStorage(true);
        webMusicManager.list = oldList;
    },[]);

    return undoSpecificListFn;
}

var undoFnContainer = { value: null };

export {
    useUndoableMusicList,
    undoFnContainer as default
};
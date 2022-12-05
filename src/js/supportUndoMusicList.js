import { useRef, useEffect, useCallback } from 'react';
import WebMusicList from './WebMusicList';
import webMusicManager from './webMusicManager';

function useUndoableMusicList() {
    const specificList = useRef(new WebMusicList());
    const oldSpecificList = useRef(new WebMusicList());

    //订阅specificList
    useEffect(() => {
        var refreshFn = () => {
            oldSpecificList.current = specificList.current;
            var newCloneList = webMusicManager.list.cloneWithNoStorage();
            specificList.current = newCloneList;
        };
        return webMusicManager.addListChangeListener(() => {
            refreshFn();
            webMusicManager.list.addChangeListener(refreshFn);
        });
    },[]);

    //撤销specificList函数
    var undoSpecificListFn = useCallback(() => {
        var oldList = oldSpecificList.current.cloneWithNoStorage();
        oldList.setStorage(true);
        webMusicManager.list = oldList;
        webMusicManager.listChangeSub.publish();
    },[]);

    return undoSpecificListFn;
}

var undoFnContainer = { value: null };

export {
    useUndoableMusicList,
    undoFnContainer as default
};
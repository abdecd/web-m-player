import React from 'react'
import { HashRouter as Router, Navigate, Outlet, Route, Routes } from 'react-router-dom'

import App from '../view/App'
import MusicList from '../view/MusicList'
import LocalList from '../view/musicList/LocalList'
import OnlineList from '../view/musicList/OnlineList'
import Lyric from '../view/Lyric'
import SearchList from '../view/musicList/SearchList'

export default function MainRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/*" element={<App><Outlet/></App>}>
                    <Route path="musicList/*" element={<MusicList><Outlet/></MusicList>}>
                        <Route path='localList' element={<LocalList/>}></Route>
                        <Route path='onlineList/:idIndex' element={<OnlineList/>}></Route>
                        <Route path='onlineList/*' element={<Navigate to="0"/>}></Route>
                        <Route path='search' element={<SearchList/>}></Route>

                        <Route path="*" element={<Navigate to="localList"/>}></Route>
                    </Route>
                    <Route path="lyric/:musicId" element={<Lyric/>}></Route>

                    <Route path="*" element={<Navigate to="musicList"/>}></Route>
                </Route>
            </Routes>
        </Router>
    )
}

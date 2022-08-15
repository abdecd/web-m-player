import React from 'react'
import { HashRouter as Router, Navigate, Outlet, Route, Routes } from 'react-router-dom'

import App from '../view/App'
import Menu from '../view/Menu'
import LocalList from '../view/menu/LocalList'
import OnlineList from '../view/menu/OnlineList'
import SearchList from '../view/menu/SearchList'
import SettingList from '../view/menu/SettingList'
import Lyric from '../view/Lyric'

export default function MainRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/*" element={<App><Outlet/></App>}>
                    <Route path="menu/*" element={<Menu><Outlet/></Menu>}>
                        <Route path='localList' element={<LocalList/>}></Route>
                        <Route path='onlineList/:idIndex' element={<OnlineList/>}></Route>
                        <Route path='onlineList/*' element={<Navigate to="0"/>}></Route>
                        <Route path='search' element={<SearchList/>}></Route>
                        <Route path='settings' element={<SettingList/>}></Route>

                        <Route path="*" element={<Navigate to="localList"/>}></Route>
                    </Route>
                    <Route path="lyric/:musicId" element={<Lyric/>}></Route>

                    <Route path="*" element={<Navigate to="menu"/>}></Route>
                </Route>
            </Routes>
        </Router>
    )
}

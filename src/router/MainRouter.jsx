import React from 'react'
import { BrowserRouter as Router, Navigate, Outlet, Route, Routes } from 'react-router-dom'

import App from '../view/App'
import MusicList from '../view/MusicList'

export default function MainRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/*" element={<App><Outlet/></App>}>
                    <Route path="musiclist/*" element={<MusicList><Outlet/></MusicList>}>
                        <Route path='locallist' element={<LocalList/>}></Route>
                        <Route path='onlinelist/:type' element={<OnlineList/>}></Route>
                        <Route path='onlinelist/*' element={<Navigate to="0"/>}></Route>

                        <Route path="*" element={<Navigate to="locallist"/>}></Route>
                    </Route>
                    <Route path="lyric/:musicId" element={<Lyric/>}></Route>

                    <Route path="*" element={<Navigate to="musiclist"/>}></Route>
                </Route>
            </Routes>
        </Router>
    )
}

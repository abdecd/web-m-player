import React from 'react'
import { Navigate, HashRouter, Outlet, Route, Routes } from 'react-router-dom'

export default function MainRouter() {
    return (
        <HashRouter>
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
        </HashRouter>
    )
}

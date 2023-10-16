import React from 'react'
import List from '@mui/material/List';
import BackgroundSettingItem from './SettingList/Background';
import ThemeSetting from './SettingList/ThemeSetting';
import ImportAndExport from './SettingList/ImportAndExport';
import VolumeSetting from './SettingList/VolumeSetting';

export default function SettingList() {
    return (
        <List>
            <BackgroundSettingItem/>
            <ThemeSetting/>
            <ImportAndExport/>
            <VolumeSetting/>
        </List>
    )
}
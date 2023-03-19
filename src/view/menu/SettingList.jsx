import React from 'react'
import List from '@mui/material/List';
import BackgroundSettingItem from './SettingList/Background';
import ThemeSettingItem from './SettingList/Theme';
import ImportAndExport from './SettingList/ImportAndExport';

export default function SettingList() {
    return (
        <List>
            <BackgroundSettingItem/>
            <ThemeSettingItem/>
            <ImportAndExport/>
        </List>
    )
}
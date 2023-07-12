import { ListItemButton, ListItemText, useTheme } from '@mui/material';
import React, { useRef, useEffect } from 'react'
import bindLongClick from '../js/click/bindLongClick'
import { styled } from 'styled-components';

const Tag = styled.div`
    line-height: 0.7em;
    font-size: 0.7em;
    padding: 0.2em;
    margin-left: 5px;
    color: #16a091;
    border: 1px solid #16a091;
    border-radius: 5px;
`

const LeftItemPrimaryLine = styled.div`
    display: flex;
    align-items: center;
    > :nth-child(1) {
        margin: 0;
        margin-right: 3px;
    }
`

var LeftItem = React.memo(({name,subName,tags=[],clickFn,longClickFn,shouldHighLight,...otherProps}) => {
    var btn = useRef();
    useEffect(() => {
        bindLongClick(btn.current,clickFn,longClickFn);
    },[clickFn,longClickFn]);

    return (
        <ListItemButton ref={btn} style={{flex: 9}} {...otherProps}>
            <ListItemText
                primary={
                    <LeftItemPrimaryLine>
                        <p>{name}</p>
                        {tags.map((x,i)=><Tag key={x+i}>{x}</Tag>)}
                    </LeftItemPrimaryLine>
                }
                secondary={subName}
                className="single-line"
                sx={shouldHighLight ? {"span": {color: "#1976d2"}} : null}/>
        </ListItemButton>
    )
});

var RightBtn = React.memo(({btnText,clickFn,longClickFn,style,...otherProps}) => {
    var btn = useRef();
    useEffect(() => {
        bindLongClick(btn.current,clickFn,longClickFn);
    },[clickFn,longClickFn]);
    var theme = useTheme();

    return (
        <ListItemButton
            ref={btn}
            {...otherProps}
            style={{textAlign: "center", flex: "0.06 1 auto", color: theme.palette.text.secondary, ...style}}>
            <ListItemText>{btnText}</ListItemText>
        </ListItemButton>
    )
});

export {
    LeftItem,
    RightBtn
};
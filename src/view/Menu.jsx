import React from 'react'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import { styled } from 'styled-components';

var SettingsBtn = React.memo(({style}) => {
    var navigate = useNavigate();
    return (
        <Button
            style={{minWidth: "30px", height:"30px", ...style}}
            onClick={() => navigate("settings")}>
            <svg style={{width: "1.5em",height: "1.5em",verticalAlign: "middle",fill: "currentColor",overflow: "hidden"}} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1891"><path d="M944.48 552.458667l-182.357333 330.666666a73.792 73.792 0 0 1-64.565334 38.325334h-362.133333a73.792 73.792 0 0 1-64.565333-38.325334l-182.357334-330.666666a75.338667 75.338667 0 0 1 0-72.682667l182.357334-330.666667a73.792 73.792 0 0 1 64.565333-38.325333h362.133333a73.792 73.792 0 0 1 64.565334 38.325333l182.357333 330.666667a75.338667 75.338667 0 0 1 0 72.682667z m-55.989333-31.146667a10.773333 10.773333 0 0 0 0-10.378667l-182.037334-330.666666a10.517333 10.517333 0 0 0-9.205333-5.482667H335.733333a10.517333 10.517333 0 0 0-9.205333 5.482667l-182.037333 330.666666a10.773333 10.773333 0 0 0 0 10.378667l182.037333 330.666667a10.517333 10.517333 0 0 0 9.205333 5.472h361.514667a10.517333 10.517333 0 0 0 9.205333-5.472l182.037334-330.666667zM513.738667 682.666667c-94.261333 0-170.666667-76.405333-170.666667-170.666667s76.405333-170.666667 170.666667-170.666667c94.250667 0 170.666667 76.405333 170.666666 170.666667s-76.416 170.666667-170.666666 170.666667z m0-64c58.912 0 106.666667-47.754667 106.666666-106.666667s-47.754667-106.666667-106.666666-106.666667-106.666667 47.754667-106.666667 106.666667 47.754667 106.666667 106.666667 106.666667z" p-id="1892"></path></svg>
        </Button>
    );
});

const StyledMenu = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    > :nth-child(1) {
        display: flex;
        height: 30px;
    }
    > :nth-child(2) {
        flex: 1 1;
        overflow: auto;
    }
`

const StyledBtnBar = styled.div`
    display: flex;
    flex: 1;
    Button {
        flex: 1
    }
`

export default function Menu({children}) {
    var navigate = useNavigate();

    return (
        <StyledMenu>
            <div>
                <SettingsBtn/>
                <StyledBtnBar>
                    <Button onClick={() => navigate("localList")}>本地</Button>
                    <Button onClick={() => navigate("onlineList")}>网络</Button>
                    <Button onClick={() => navigate("search")}>搜索</Button>
                </StyledBtnBar>
            </div>

            <div>{children}</div>
        </StyledMenu>
    )
}

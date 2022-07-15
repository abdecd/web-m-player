var td = null, clicked = false;
function betterDblClick(clickFn,dblClickFn) {
    return (...sth) => {
        clearTimeout(td);
        if (clicked==false) {
            clicked = true;
            td = setTimeout(() =>{
                clicked = false;
                clickFn(...sth);
            },400);
        } else {
            clicked = false;
            dblClickFn(...sth);
        }
    }
};

export default betterDblClick;
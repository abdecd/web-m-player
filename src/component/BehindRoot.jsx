import React, { Component } from 'react';
import ReactDom from 'react-dom/client';

export default class BehindRoot extends Component {
    componentDidMount() {//新建一个div标签并塞进body
        this.popup = document.createElement("div");
        document.body.appendChild(this.popup);
        
        this.reactPopup = ReactDom.createRoot(this.popup);
        this._renderLayer();
    }
    componentDidUpdate() {
        this._renderLayer();
    }
    componentWillUnmount() {//在组件卸载的时候，保证弹层也被卸载掉
        setTimeout(() => {
            document.body.removeChild(this.popup);
            this.reactPopup.unmount();
        },0);
    }
    _renderLayer() {//将弹层渲染到body下的div标签
        this.reactPopup.render(this.props.children);
    }
    render() {
        return null;
    }
}
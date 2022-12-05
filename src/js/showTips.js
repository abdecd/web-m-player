import Subscription from "./Subscription";

var showTips = {
    changeSub: new Subscription(),//回调见下面
    subscribe(fn) { return this.changeSub.subscribe(fn); },
    unSubscribe(fn) { this.changeSub.unsubscribe(fn); },

    info(msg,fn) { this.changeSub.publish(msg,fn) },
    prompt(...sth) { return window.prompt(...sth); },
    confirm(tip) { return window.confirm(tip); },
};

export default showTips;
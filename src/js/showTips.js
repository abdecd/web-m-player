import Subscription from "./Subscription";

var showTips = {
    changeSub: new Subscription(),
    subscribe(fn) { this.changeSub.add(fn); },
    unSubscribe(fn) { this.changeSub.remove(fn); },

    info(msg,fn) { this.changeSub.publish(msg,fn) },
    prompt(...sth) { return window.prompt(...sth); },
    confirm(tip) { return window.confirm(tip); },
};

export default showTips;
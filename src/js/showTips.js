import Subscription from "./Subscription";

var showTips = {
    changeSub: new Subscription(),
    subscribe(fn) { this.changeSub.add(fn); },
    unSubscribe(fn) { this.changeSub.remove(fn); },

    info(msg) { this.changeSub.publish(msg) },
    prompt(...sth) { return window.prompt(...sth); },
};

export default showTips;
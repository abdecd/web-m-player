import BScroll from "@better-scroll/core"

var betterBScroll = {
    bScrolls: [],
    elements: [],
    manage(elem) {
        if (!this.elements.includes(elem)) {
            this.bScrolls.push(new BScroll(elem));
            this.elements.push(elem);
        } else {
            this.bScrolls[this.elements.indexOf(elem)].refresh();
        }
    },
};

export default betterBScroll;
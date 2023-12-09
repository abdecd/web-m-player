class Draggable {
    wrapper = null;
    view = null;
    rectList = [];
    firstIndex = -1;
    currentIndex = -1;
    dragElem = null;
    clone = { element: null, x: -1, y: -1 };
    lastDraggingPos = { y: -1 };
    lastScrollPos = { top: -1 };
    isDragging = false;

    constructor({
        wrapper,
        view,
        holderClassName = "holder",
        cb
    }) {
        this.wrapper = wrapper;
        this.view = view || wrapper;
        this.holderClassName = holderClassName;
        this.cb = cb || this.defaultCb;

        this.initHandleScroll();
        this.initListeners();
        this.bindWrapperListener();
    }

    terminate() {
        this.revokeWrapperListener();
    }

    defaultCb = draggable => {
        var beforeIndex = this.currentIndex+(this.currentIndex>this.firstIndex ? 1 : 0);
        this.wrapper.insertBefore(this.dragElem,this.wrapper.children[beforeIndex]);
    };
    
    initListeners() {
        this.onPointerDownListener = this.onPointerDown.bind(this);
        this.onPointerMoveListener = this.onPointerMove.bind(this);
        this.onPointerUpListener = this.onPointerUp.bind(this);
    }
    bindWrapperListener() {
        this.view.addEventListener('pointerdown',this.onPointerDownListener,true);
        Array.prototype.forEach.call(this.view.querySelectorAll("."+this.holderClassName),elem => {
            elem.style.touchAction = "none";
        });
    }
    revokeWrapperListener() {
        this.view.removeEventListener('pointerdown',this.onPointerDownListener,true);
        Array.prototype.forEach.call(this.view.querySelectorAll("."+this.holderClassName),elem => {
            elem.style.touchAction = "";
        });
    }

    getRectList() {
        this.rectList.length = 0;
        for (const item of this.wrapper.children) {
            this.rectList.push(item.getBoundingClientRect());
        }
    }

    getDragElem(ev) {
        var temp = ev.target;
        while (
            temp.tagName.toLowerCase()!="body"
            && temp!=this.view
            && !temp.classList.contains(this.holderClassName)
        ) temp = temp.parentNode;
        if (temp==this.view || temp.tagName.toLowerCase()=="body") return null;
        while (
            temp.tagName.toLowerCase()!="body"
            && !Array.prototype.includes.call(this.wrapper.children,temp)
        ) temp = temp.parentNode;
        if (temp.tagName.toLowerCase()=="body") return null;

        return temp;
    }
    onPointerDown(ev) {
        this.dragElem = this.getDragElem(ev);
        if (!this.dragElem) return;
        document.documentElement.addEventListener('pointermove',this.onPointerMoveListener,{capture: true, passive: true});
        document.documentElement.addEventListener('pointerup',this.onPointerUpListener,{capture: true,once: true});

        this.getRectList();
        this.cloneNodeToDrag();
        this.isDragging = true;
        this.lastDraggingPos = { y: ev.clientY };
        this.lastScrollPos = { top: this.view.scrollTop };
        this.dragElem.style.opacity = 0;
        for (let elem of this.wrapper.children) elem.style.transition = "transform 0.2s";
    }
    
    cloneStyle(obj={s,d}) {
        var children = [obj];
        while (children.length) {
            var {s, d} = children.shift();
            var computed = window.getComputedStyle(s);
            
            d.style.width = computed.width;
            d.style.height = computed.height;
            d.style.display = computed.display;
            d.style.flex = computed.flex;
            
            for (var i=0;i<d.children.length;i++) children.push({s: s.children[i], d: d.children[i]});
        }
    }
    cloneNodeToDrag() {
        this.dragElem.classList.add('active');
        this.clone.element = this.dragElem.cloneNode(true);
        this.cloneStyle({s: this.dragElem, d: this.clone.element});

        const index = Array.prototype.indexOf.call(this.wrapper.children, this.dragElem);
        this.currentIndex = this.firstIndex = index;

        this.clone.x = this.rectList[index].left;
        this.clone.y = this.rectList[index].top;

        this.clone.element.className = 'clone-item';
        `position: fixed;
        left: 0;
        top: 0;

        z-index: 1;
        list-style: none;
        user-select: none;
        pointer-events: none;

        transition: none;
        transform: translate3d(${this.clone.x}px, ${this.clone.y}px, 0);
        `.trim().split(/;\n* *\t*/).map(line => line.trim().split(": "))
        .forEach(arr => this.clone.element.style[arr[0]] = arr[1]);
        document.body.appendChild(this.clone.element);
    }

    onPointerMove(ev) {
        if (!this.isDragging) return;
        this.moveClone(ev);
        this.swapItem(ev);
        this.handleScroll(ev);
    }

    moveClone(ev) {
        this.clone.y += ev.clientY - this.lastDraggingPos.y;
        this.lastDraggingPos = { y: ev.clientY };
        this.clone.element.style.transform = `translate3d(${this.clone.x}px, ${this.clone.y}px, 0)`;
    }

    swapItem(ev) {
        var newIndex = -1;
        for (let i = 0; i < this.rectList.length; i++) {
            if (
                i != this.currentIndex
                && ev.clientY > this.rectList[i].top-(this.view.scrollTop-this.lastScrollPos.top)
                && ev.clientY < this.rectList[i].bottom-(this.view.scrollTop-this.lastScrollPos.top)
            ) {
                // 碰到了第 i 个元素
                newIndex = this.currentIndex = i;
                break;
            }
        }
        if (newIndex==-1) return;

        
        for (let elem of this.wrapper.children) {
            elem.style.transform = 'translate3d(0,0,0)';
        }
        if (this.currentIndex>this.firstIndex) {
            for (let i=this.firstIndex;i<this.currentIndex;i++) {
                let offsetY = this.rectList[i].top-this.rectList[i+1].top;
                this.wrapper.children[i+1].style.transform = `translate3d(0px, ${offsetY}px, 0)`;
            }
            let offsetY = this.rectList[this.currentIndex].top-this.rectList[this.firstIndex].top;
            this.wrapper.children[this.firstIndex].style.transform = `translate3d(0px, ${offsetY}px, 0)`;
        } else if (this.currentIndex<this.firstIndex) {
            for (let i=this.currentIndex;i<this.firstIndex;i++) {
                let offsetY = this.rectList[i+1].top-this.rectList[i].top;
                this.wrapper.children[i].style.transform = `translate3d(0px, ${offsetY}px, 0)`;
            }
            let offsetY = this.rectList[this.currentIndex].top-this.rectList[this.firstIndex].top;
            this.wrapper.children[this.firstIndex].style.transform = `translate3d(0px, ${offsetY}px, 0)`;
        }
    }

    initHandleScroll() {
        this.viewRect = this.view.getBoundingClientRect();
        this.scrollMaskHeight = (this.viewRect.bottom - this.viewRect.top) / 4;
        this.maxV = 8;
    }
    handleScroll(ev) {
        var clientY = ev.clientY;
        if (clientY > this.viewRect.bottom - this.scrollMaskHeight) {
            var pace = (clientY - this.viewRect.bottom + this.scrollMaskHeight) / this.scrollMaskHeight * this.maxV;
            if (pace > this.maxV) pace = this.maxV;
            this.view.scrollTop += pace;
        } else if (clientY < this.viewRect.top + this.scrollMaskHeight) {
            var pace = (this.viewRect.top + this.scrollMaskHeight - clientY) / this.scrollMaskHeight * this.maxV;
            if (pace > this.maxV) pace = this.maxV;
            this.view.scrollTop -= pace;
        }
    }

    onPointerUp(ev) {
        document.documentElement.removeEventListener('pointermove',this.onPointerMoveListener,{capture: true, passive: true});
        if (!this.isDragging) return;
        this.isDragging = false;

        this.cb(this);

        this.dragElem.classList.remove('active');
        this.clone.element.remove();
        this.dragElem.style.opacity = 1;

        for (const item of this.wrapper.children) {
            item.style.transition = 'none';
            item.style.transform = 'translate3d(0,0,0)';
        }
    }
}

export default Draggable;
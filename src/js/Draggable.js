class Draggable {
    wrapper = null;
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
        holderClassName = "holder",
        cb = draggable => {
            var beforeIndex = this.currentIndex+(this.currentIndex>this.firstIndex ? 1 : 0);
            this.wrapper.insertBefore(this.dragElem,this.wrapper.children[beforeIndex]);
        }
    }) {
        this.wrapper = wrapper;
        this.holderClassName = holderClassName;
        this.cb = cb;

        this.initHandleScroll();
        this.initListeners();
        this.bindWrapperListener();
    }

    terminate() {
        this.revokeWrapperListener();
    }
    
    initListeners() {
        this.onPointerDownListener = this.onPointerDown.bind(this);
        this.onPointerMoveListener = this.onPointerMove.bind(this);
        this.onPointerUpListener = this.onPointerUp.bind(this);
    }
    bindWrapperListener() {
        this.wrapper.querySelectorAll("."+this.holderClassName).forEach(elem => elem.addEventListener('pointerdown',this.onPointerDownListener));
        document.documentElement.addEventListener('pointermove',this.onPointerMoveListener);
        document.documentElement.addEventListener('pointerup',this.onPointerUpListener);
    }
    revokeWrapperListener() {
        this.wrapper.querySelectorAll("."+this.holderClassName).forEach(elem => elem.removeEventListener('pointerdown',this.onPointerDownListener));
        document.documentElement.removeEventListener('pointermove',this.onPointerMoveListener);
        document.documentElement.removeEventListener('pointerup',this.onPointerUpListener);
    }

    getRectList() {
        this.rectList.length = 0;
        for (const item of this.wrapper.children) {
            this.rectList.push(item.getBoundingClientRect());
        }
    }

    onPointerDown(ev) {
        this.wrapper.style.touchAction = "none";
        this.getRectList();
        this.cloneNodeToDrag(ev);
        this.isDragging = true;
        this.lastDraggingPos = { y: ev.clientY };
        this.lastScrollPos = { top: this.wrapper.scrollTop };
        this.dragElem.style.opacity = 0;
        for (let elem of this.wrapper.children) elem.style.transition = "transform 0.2s";
    }
    
    isInParentTree(parent,child) {
        var temp = child;
        while (temp.tagName.toLowerCase()!="body" && temp!=parent) temp = temp.parentNode;
        return temp==parent;
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
    cloneNodeToDrag(ev) {
        this.dragElem = Array.prototype.find.call(this.wrapper.children,elem => this.isInParentTree(elem,ev.target));
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
        if (!this.isDragging) return false;
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
                && ev.clientY > this.rectList[i].top-(this.wrapper.scrollTop-this.lastScrollPos.top)
                && ev.clientY < this.rectList[i].bottom-(this.wrapper.scrollTop-this.lastScrollPos.top)
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
        this.wrapperRect = this.wrapper.getBoundingClientRect();
        this.scrollMaskHeight = (this.wrapperRect.bottom - this.wrapperRect.top) / 4;
        this.maxV = 5;
    }
    handleScroll(ev) {
        var clientY = ev.clientY;
        if (clientY > this.wrapperRect.bottom - this.scrollMaskHeight) {
            var pace = (clientY - this.wrapperRect.bottom + this.scrollMaskHeight) / this.scrollMaskHeight * this.maxV;
            if (pace > this.maxV) pace = this.maxV;
            this.wrapper.scrollTop += pace;
        } else if (clientY < this.wrapperRect.top + this.scrollMaskHeight) {
            var pace = (this.wrapperRect.top + this.scrollMaskHeight - clientY) / this.scrollMaskHeight * this.maxV;
            if (pace > this.maxV) pace = this.maxV;
            this.wrapper.scrollTop -= pace;
        }
    }

    onPointerUp(ev) {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.wrapper.style.touchAction = "";

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
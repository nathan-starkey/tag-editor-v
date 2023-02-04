export default class CommonControl {
    element;
    name;
    children;
    parent = null;
    constructor(element, name = "", children = []) {
        this.element = element;
        this.name = name;
        children = Array.from(children);
        for (let child of children) {
            child.parent = this;
            if (child.name) {
                children[child.name] = child;
            }
        }
        this.children = children;
    }
    get disabled() {
        return "disabled" in this.element ? this.element.disabled : this.element.classList.contains("disabled");
    }
    set disabled(disabled) {
        if (disabled) {
            this.value = undefined;
        }
        if ("disabled" in this.element) {
            this.element.disabled = disabled;
        }
        else {
            if (disabled) {
                this.element.classList.add("disabled");
            }
            else {
                this.element.classList.remove("disabled");
            }
        }
        for (let child of this.children) {
            child.disabled = disabled;
        }
    }
    notifyChange() {
        if (this.parent) {
            this.parent.notifyChange();
        }
    }
}

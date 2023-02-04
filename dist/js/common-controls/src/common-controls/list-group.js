import CommonControl from "./common-control";
import ListGroupView from "./list-group-view";
import MultiInstanceEditor from "./multi-instance-editor";
export default class ListGroup extends CommonControl {
    displayMode = "block";
    view;
    items;
    nameItem;
    constructor(arg0, arg1, arg2) {
        let name = "";
        if (typeof arg0 == "string") {
            name = arg0;
        }
        let children = [];
        if (typeof arg0 == "object") {
            children.push(arg0);
        }
        else if (typeof arg1 == "object") {
            children.push(arg1);
        }
        let nameItem = (item, index) => index.toString();
        if (typeof arg1 == "function") {
            nameItem = arg1;
        }
        else if (typeof arg2 == "function") {
            nameItem = arg2;
        }
        let view = new ListGroupView(name, (index) => this.items.select(index), () => this.items.add(), () => this.items.remove(), (offset) => this.items.move(offset));
        super(view.outer, name, children);
        this.view = view;
        this.nameItem = nameItem;
        this.items = new MultiInstanceEditor(() => children[0].value, (item) => children[0].value = item, (clean) => { if (clean) {
            this.render();
        }
        else {
            this.notifyChange();
        } });
        this.view.body.appendChild(children[0].element);
        this.render();
    }
    get value() {
        return this.items.export();
    }
    set value(value) {
        this.items.import(value);
    }
    get disabled() {
        return this.element.classList.contains("disabled");
    }
    set disabled(disabled) {
        if (disabled) {
            this.items.items = [];
            this.items.index = -1;
            this.element.classList.add("disabled");
        }
        else {
            this.element.classList.remove("disabled");
        }
        for (let child of this.children) {
            child.disabled = disabled;
        }
        this.render();
    }
    notifyChange() {
        super.notifyChange();
        this.render();
    }
    render() {
        this.items.store();
        this.children[0].disabled = this.items.items.length == 0;
        this.view.render(this.disabled, this.items.items.map((item, index) => this.nameItem(item, index) || "(empty)"), this.items.index);
    }
}

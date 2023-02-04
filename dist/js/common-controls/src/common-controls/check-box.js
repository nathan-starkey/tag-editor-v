import CommonControl from "./common-control";
export default class CheckBox extends CommonControl {
    constructor(name) {
        super(document.createElement("input"), name);
        this.element.type = "checkbox";
        this.element.addEventListener("change", () => this.notifyChange());
    }
    get value() {
        return this.element.checked;
    }
    set value(value) {
        this.element.checked = value;
    }
}

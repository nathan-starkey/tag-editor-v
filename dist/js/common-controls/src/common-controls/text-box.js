import CommonControl from "./common-control";
export default class TextBox extends CommonControl {
    constructor(name) {
        super(document.createElement("input"), name);
        this.element.addEventListener("change", () => this.notifyChange());
    }
    get value() {
        return this.element.value;
    }
    set value(value) {
        this.element.value = value || "";
    }
}

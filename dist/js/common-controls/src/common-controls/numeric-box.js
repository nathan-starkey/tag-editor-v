import CommonControl from "./common-control";
export default class NumericBox extends CommonControl {
    constructor(name) {
        super(document.createElement("input"), name);
        this.element.type = "number";
        this.element.addEventListener("change", () => this.notifyChange());
        this.value = 0;
    }
    get value() {
        return this.element.valueAsNumber || 0;
    }
    set value(value) {
        this.element.valueAsNumber = Number(value) || 0;
    }
}

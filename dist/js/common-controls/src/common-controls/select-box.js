import CommonControl from "./common-control";
export default class SelectBox extends CommonControl {
    constructor(arg0, arg1) {
        let name = "";
        if (typeof arg0 == "string") {
            name = arg0;
        }
        let options = [];
        if (Array.isArray(arg0)) {
            options = arg0;
        }
        else if (Array.isArray(arg1)) {
            options = arg1;
        }
        super(document.createElement("select"), name);
        for (let option of options) {
            this.element.add(new Option(option));
        }
        this.element.addEventListener("change", () => this.notifyChange());
    }
    get value() {
        return this.element.value;
    }
    set value(value) {
        this.element.value = value || "";
        if (this.element.selectedIndex == -1) {
            this.element.selectedIndex = 0;
        }
    }
}

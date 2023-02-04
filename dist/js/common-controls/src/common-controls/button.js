import CommonControl from "./common-control";
export default class Button extends CommonControl {
    hideName = true;
    constructor(arg0, arg1, arg2) {
        let label = "";
        let name = "";
        let callback = () => { };
        if (typeof arg1 == "string") {
            name = arg0;
            label = arg1;
            callback = arg2 || callback;
        }
        else {
            label = arg0;
            callback = arg1 || callback;
        }
        super(document.createElement("button"), name);
        this.element.innerText = label;
        this.element.addEventListener("click", () => callback());
    }
    get value() {
        return null;
    }
    set value(value) {
    }
    click() {
        this.element.click();
    }
}

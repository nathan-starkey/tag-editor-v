import CommonControl from "./common-control";
export default class TextOutput extends CommonControl {
    hideName = true;
    constructor(name) {
        super(document.createElement("span"), name);
    }
    get value() {
        return null;
    }
    set value(value) {
        this.text = value || "";
    }
    set disabled(disabled) {
        super.disabled = disabled;
        this.text = "";
    }
    get text() {
        return this.element.innerText;
    }
    set text(text) {
        this.element.innerText = text;
    }
    get html() {
        return this.element.innerHTML;
    }
    set html(html) {
        this.element.innerHTML = html;
    }
}

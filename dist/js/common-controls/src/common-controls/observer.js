import CommonControl from "./common-control";
export default class Observer extends CommonControl {
    callback;
    constructor(child, callback) {
        super(null, "", [child]);
        this.callback = callback;
    }
    get value() {
        return null;
    }
    set value(value) {
    }
    get disabled() {
        return false;
    }
    set disabled(disabled) {
    }
    notifyChange() {
        if (this.callback) {
            this.callback(this);
        }
    }
}

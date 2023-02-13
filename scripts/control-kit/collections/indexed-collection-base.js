define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class IndexedCollectionBase {
        name;
        control;
        items = [];
        index = -1;
        constructor(control, name = "") {
            this.control = control;
            this.name = name;
            control.setValue(null);
        }
        store() {
            if (this.index == -1) {
                return;
            }
            this.items[this.index] = this.control.getValue();
        }
        setValue(value) {
            this.items = [];
            this.index = -1;
            this.control.setValue(null);
            if (!Array.isArray(value)) {
                value = [];
            }
            for (let i = 0; i < value.length; ++i) {
                this.control.setValue(value[i]);
                this.items.push(this.control.getValue());
            }
            this.render(this.items.length - 1);
        }
        getValue() {
            this.store();
            return Array.from(this.items);
        }
        append() {
            this.store();
            this.control.setValue(undefined);
            this.items.push(this.control.getValue());
            this.render(this.items.length - 1);
        }
        insert() {
            if (this.index == -1) {
                return false;
            }
            this.store();
            this.control.setValue(undefined);
            this.items.splice(this.index, 0, this.control.getValue());
            this.render(this.index);
            return true;
        }
        delete() {
            if (this.index == -1) {
                return false;
            }
            let index = this.index;
            if (this.index == this.items.length - 1) {
                --this.index;
            }
            this.items.splice(index, 1);
            if (this.index == -1) {
                this.control.setValue(null);
            }
            else {
                this.control.setValue(this.items[this.index]);
            }
            this.render(this.index);
            return true;
        }
        move(to) {
            if (this.index == -1) {
                return false;
            }
            this.store();
            let from = this.index;
            let item = this.items[from];
            this.items[from] = this.items[to];
            this.items[to] = item;
            this.render(to);
            return true;
        }
    }
    exports.default = IndexedCollectionBase;
});
//# sourceMappingURL=indexed-collection-base.js.map
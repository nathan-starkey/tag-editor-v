define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class KeyedCollection {
        name;
        controls = [];
        namedControls = {};
        table = document.createElement("table");
        tbody = document.createElement("tbody");
        constructor(name = "") {
            this.name = name;
            this.table.classList.add("keyed-collection");
            this.table.append(this.tbody);
        }
        getElement() {
            return this.table;
        }
        push(control, display = "inline") {
            this.controls.push(control);
            control.setValue(undefined);
            if (control.name) {
                this.namedControls[control.name] = control;
            }
            if (display == "inline") {
                let tr = document.createElement("tr");
                let td0 = document.createElement("td");
                let td1 = document.createElement("td");
                td0.innerText = control.name;
                td1.append(control.getElement());
                tr.append(td0, td1);
                this.tbody.append(tr);
            }
            else if (display == "block") {
                let tr = document.createElement("tr");
                let td = document.createElement("td");
                td.colSpan = 2;
                td.append(control.getElement());
                tr.append(td);
                this.tbody.append(tr);
            }
            return this;
        }
        pushBlock(control) {
            return this.push(control, "block");
        }
        pushHidden(control) {
            return this.push(control, "hidden");
        }
        setValue(value) {
            if (typeof value != "object") {
                value = {};
            }
            for (let control of this.controls) {
                control.setValue(value === null ? null : value[control.name]);
            }
        }
        getValue() {
            let value = {};
            for (let control of this.controls) {
                if (control.name) {
                    value[control.name] = control.getValue();
                }
            }
            return value;
        }
    }
    exports.default = KeyedCollection;
});
//# sourceMappingURL=keyed-collection.js.map
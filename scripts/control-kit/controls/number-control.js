define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class NumberControl {
        name;
        element = document.createElement("input");
        constructor(name = "") {
            this.name = name;
            this.element.type = "number";
        }
        getElement() {
            return this.element;
        }
        setValue(value) {
            this.element.value = Number.isNaN(value) ? "" : value ?? "";
            this.element.disabled = value === null;
        }
        getValue() {
            return this.element.valueAsNumber;
        }
    }
    exports.default = NumberControl;
});
//# sourceMappingURL=number-control.js.map
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CheckboxControl {
        name;
        element = document.createElement("input");
        constructor(name = "") {
            this.name = name;
            this.element.type = "checkbox";
        }
        getElement() {
            return this.element;
        }
        setValue(value) {
            this.element.checked = value;
            this.element.disabled = value === null;
        }
        getValue() {
            return this.element.checked;
        }
    }
    exports.default = CheckboxControl;
});
//# sourceMappingURL=checkbox-control.js.map
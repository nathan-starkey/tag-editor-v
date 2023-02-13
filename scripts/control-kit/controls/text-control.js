define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TextControl {
        name;
        element = document.createElement("input");
        constructor(name = "") {
            this.name = name;
        }
        getElement() {
            return this.element;
        }
        setValue(value) {
            this.element.value = value ?? "";
            this.element.disabled = value === null;
        }
        getValue() {
            return this.element.value;
        }
    }
    exports.default = TextControl;
});
//# sourceMappingURL=text-control.js.map
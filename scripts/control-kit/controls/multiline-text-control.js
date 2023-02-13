define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MultilineTextControl {
        name;
        element = document.createElement("textarea");
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
    exports.default = MultilineTextControl;
});
//# sourceMappingURL=multiline-text-control.js.map
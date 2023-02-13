define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class HiddenControl {
        name;
        value;
        element = document.createElement("span");
        constructor(name = "") {
            this.name = name;
            this.element.innerText = "Hidden";
        }
        getElement() {
            return this.element;
        }
        setValue(value) {
            this.value = value;
        }
        getValue() {
            return this.value;
        }
    }
    exports.default = HiddenControl;
});
//# sourceMappingURL=hidden-control.js.map
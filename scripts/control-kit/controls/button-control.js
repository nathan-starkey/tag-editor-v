define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ButtonControl {
        name = "";
        container = document.createElement("div");
        button = document.createElement("button");
        message = document.createElement("div");
        constructor(label, callback) {
            this.button.innerText = label;
            this.button.addEventListener("pointerdown", () => this.button.disabled || callback.call(this));
            this.container.append(this.button, this.message);
        }
        getElement() {
            return this.container;
        }
        setValue(value) {
            this.button.disabled = value === null;
            this.message.innerText = "";
        }
        getValue() {
            return null;
        }
        output(message) {
            this.message.innerText = message;
        }
    }
    exports.default = ButtonControl;
});
//# sourceMappingURL=button-control.js.map
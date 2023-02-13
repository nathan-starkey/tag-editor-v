define(["require", "exports", "./indexed-collection-base", "./keyed-collection"], function (require, exports, indexed_collection_base_1, keyed_collection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class IndexedCollection extends indexed_collection_base_1.default {
        container = document.createElement("div");
        header = document.createElement("div");
        body = document.createElement("div");
        label = document.createElement("span");
        select = document.createElement("select");
        appendButton = document.createElement("button");
        insertButton = document.createElement("button");
        deleteButton = document.createElement("button");
        moveUpButton = document.createElement("button");
        moveDownButton = document.createElement("button");
        constructor(control, name = "") {
            super(control, name);
            this.label.innerText = name;
            this.appendButton.innerText = "Append";
            this.insertButton.innerText = "Insert";
            this.deleteButton.innerText = "Delete";
            this.moveUpButton.innerHTML = "&#9650;";
            this.moveDownButton.innerHTML = "&#9660;";
            this.label.addEventListener("pointerdown", () => this.container.classList.toggle("collapsed"));
            this.select.addEventListener("change", (event) => { event.stopImmediatePropagation(); this.store(); this.render(this.select.selectedIndex); this.control.setValue(this.items[this.index]); });
            this.appendButton.addEventListener("pointerdown", () => this.appendButton.disabled || this.append());
            this.insertButton.addEventListener("pointerdown", () => this.insertButton.disabled || this.insert());
            this.deleteButton.addEventListener("pointerdown", () => this.deleteButton.disabled || this.delete());
            this.moveUpButton.addEventListener("pointerdown", () => this.moveUpButton.disabled || this.move(this.index - 1));
            this.moveDownButton.addEventListener("pointerdown", () => this.moveDownButton.disabled || this.move(this.index + 1));
            this.container.classList.add("indexed-collection");
            this.container.append(this.header, this.body);
            this.header.append(this.label, this.select, this.appendButton, this.insertButton, this.deleteButton, this.moveUpButton, this.moveDownButton);
            this.body.append(this.control.getElement());
            this.render(-1);
        }
        getElement() {
            return this.container;
        }
        render(index) {
            let isKeyedCollection = this.control instanceof keyed_collection_1.default;
            this.select.innerHTML = "";
            for (let item of this.items) {
                let name;
                if (isKeyedCollection) {
                    name = item ? String(Object.values(item)[0]) : "NULL | UNDEFINED";
                }
                else {
                    name = String(item);
                }
                name ||= "unnamed";
                this.select.add(new Option(name));
            }
            this.index = index;
            this.select.selectedIndex = index;
            this.select.disabled = this.index == -1;
            this.insertButton.disabled = this.index == -1;
            this.deleteButton.disabled = this.index == -1;
            this.moveUpButton.disabled = this.index <= 0;
            this.moveDownButton.disabled = this.index == -1 || this.index == this.items.length - 1;
        }
        setValue(value) {
            super.setValue(value);
            this.appendButton.disabled = value === null;
        }
        append() {
            super.append();
            this.appendButton.dispatchEvent(new Event("change", { bubbles: true }));
        }
        insert() {
            if (super.insert()) {
                this.insertButton.dispatchEvent(new Event("change", { bubbles: true }));
                return true;
            }
            return false;
        }
        delete() {
            if (super.delete()) {
                this.deleteButton.dispatchEvent(new Event("change", { bubbles: true }));
                return true;
            }
            return false;
        }
        move(to) {
            if (super.move(to)) {
                this.moveUpButton.dispatchEvent(new Event("change", { bubbles: true }));
                return true;
            }
            return false;
        }
    }
    exports.default = IndexedCollection;
});
//# sourceMappingURL=indexed-collection.js.map
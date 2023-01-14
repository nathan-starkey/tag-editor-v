var Extensions = (function () {
    'use strict';

    class CommonControl {
        element;
        name;
        children;
        parent = null;
        constructor(element, name = "", children = []) {
            this.element = element;
            this.name = name;
            children = Array.from(children);
            for (let child of children) {
                child.parent = this;
                if (child.name) {
                    children[child.name] = child;
                }
            }
            this.children = children;
        }
        get disabled() {
            return "disabled" in this.element ? this.element.disabled : this.element.classList.contains("disabled");
        }
        set disabled(disabled) {
            if (disabled) {
                this.value = undefined;
            }
            if ("disabled" in this.element) {
                this.element.disabled = disabled;
            }
            else {
                if (disabled) {
                    this.element.classList.add("disabled");
                }
                else {
                    this.element.classList.remove("disabled");
                }
            }
            for (let child of this.children) {
                child.disabled = disabled;
            }
        }
        notifyChange() {
            if (this.parent) {
                this.parent.notifyChange();
            }
        }
    }

    class CheckBox extends CommonControl {
        constructor(name) {
            super(document.createElement("input"), name);
            this.element.type = "checkbox";
            this.element.addEventListener("change", () => this.notifyChange());
        }
        get value() {
            return this.element.checked;
        }
        set value(value) {
            this.element.checked = value;
        }
    }

    class ListGroupView {
        outer = document.createElement("div");
        header = document.createElement("div");
        body = document.createElement("div");
        label = document.createElement("label");
        combo = document.createElement("select");
        buttonAdd = document.createElement("button");
        buttonRemove = document.createElement("button");
        buttonMoveUp = document.createElement("button");
        buttonMoveDown = document.createElement("button");
        constructor(name, select, add, remove, move) {
            this.label.innerText = name;
            this.buttonAdd.innerText = "Add";
            this.buttonRemove.innerText = "Remove";
            this.buttonMoveUp.innerHTML = "&#9650;";
            this.buttonMoveDown.innerHTML = "&#9660;";
            this.outer.classList.add("list-group");
            this.header.append(this.label, this.combo, this.buttonAdd, this.buttonRemove, this.buttonMoveUp, this.buttonMoveDown);
            this.outer.append(this.header, this.body);
            this.label.addEventListener("click", () => this.outer.classList.toggle("collapsed"));
            this.combo.addEventListener("change", () => select(this.combo.selectedIndex));
            this.buttonAdd.addEventListener("click", () => add());
            this.buttonRemove.addEventListener("click", () => remove());
            this.buttonMoveUp.addEventListener("click", () => move(-1));
            this.buttonMoveDown.addEventListener("click", () => move(1));
        }
        render(isDisabled, options, index) {
            this.combo.innerHTML = "";
            for (let option of options) {
                this.combo.options.add(new Option(option));
            }
            this.combo.selectedIndex = index;
            let isEmpty = options.length == 0;
            let isFirst = index == 0;
            let isLast = index == options.length - 1;
            this.combo.disabled = isDisabled || isEmpty;
            this.buttonAdd.disabled = isDisabled;
            this.buttonRemove.disabled = isDisabled || isEmpty;
            this.buttonMoveUp.disabled = isDisabled || isEmpty || isFirst;
            this.buttonMoveDown.disabled = isDisabled || isEmpty || isLast;
        }
    }

    class MultiInstanceEditor {
        pull;
        push;
        notifyChange;
        items = [];
        index = -1;
        constructor(pull, push, notifyChange) {
            this.pull = pull;
            this.push = push;
            this.notifyChange = notifyChange;
        }
        store() {
            if (this.index != -1) {
                this.items[this.index] = this.pull();
            }
        }
        restore() {
            this.push(this.index == -1 ? undefined : this.items[this.index]);
        }
        clear() {
            this.items.length = 0;
            this.index = -1;
            this.notifyChange(false);
        }
        add() {
            this.store();
            this.push(undefined);
            this.items.push(this.pull());
            this.index = this.items.length - 1;
            this.restore();
            this.notifyChange(false);
        }
        move(offset) {
            let index = this.index + offset;
            if (Number.isInteger(offset) && offset != 0 && index >= 0 && index < this.items.length && this.index != -1) {
                let other = this.items[index];
                this.items[index] = this.items[this.index];
                this.items[this.index] = other;
                this.index = index;
                this.notifyChange(false);
            }
        }
        remove() {
            this.items.splice(this.index, 1);
            this.index = Math.min(this.index, this.items.length - 1);
            this.restore();
            this.notifyChange(false);
        }
        select(index) {
            if (Number.isInteger(index) && index >= -1 && index < this.items.length) {
                this.store();
                this.index = index;
                this.restore();
                this.notifyChange(true);
            }
        }
        export() {
            this.store();
            return Array.from(this.items);
        }
        import(items) {
            if (!Array.isArray(items)) {
                items = [];
            }
            this.items.length = 0;
            this.index = -1;
            for (let item of items) {
                this.push(item);
                this.items.push(this.pull());
            }
            this.index = this.items.length - 1;
            this.notifyChange(true);
        }
    }

    class ListGroup extends CommonControl {
        displayMode = "block";
        view;
        items;
        nameItem;
        constructor(arg0, arg1, arg2) {
            let name = "";
            if (typeof arg0 == "string") {
                name = arg0;
            }
            let children = [];
            if (typeof arg0 == "object") {
                children.push(arg0);
            }
            else if (typeof arg1 == "object") {
                children.push(arg1);
            }
            let nameItem = (item, index) => index.toString();
            if (typeof arg1 == "function") {
                nameItem = arg1;
            }
            else if (typeof arg2 == "function") {
                nameItem = arg2;
            }
            let view = new ListGroupView(name, (index) => this.items.select(index), () => this.items.add(), () => this.items.remove(), (offset) => this.items.move(offset));
            super(view.outer, name, children);
            this.view = view;
            this.nameItem = nameItem;
            this.items = new MultiInstanceEditor(() => children[0].value, (item) => children[0].value = item, (clean) => { if (clean) {
                this.render();
            }
            else {
                this.notifyChange();
            } });
            this.view.body.appendChild(children[0].element);
            this.render();
        }
        get value() {
            return this.items.export();
        }
        set value(value) {
            this.items.import(value);
        }
        get disabled() {
            return this.element.classList.contains("disabled");
        }
        set disabled(disabled) {
            if (disabled) {
                this.items.items = [];
                this.items.index = -1;
                this.element.classList.add("disabled");
            }
            else {
                this.element.classList.remove("disabled");
            }
            for (let child of this.children) {
                child.disabled = disabled;
            }
            this.render();
        }
        notifyChange() {
            super.notifyChange();
            this.render();
        }
        render() {
            this.items.store();
            this.children[0].disabled = this.items.items.length == 0;
            this.view.render(this.disabled, this.items.items.map((item, index) => this.nameItem(item, index) || "(empty)"), this.items.index);
        }
    }

    class NumericBox extends CommonControl {
        constructor(name) {
            super(document.createElement("input"), name);
            this.element.type = "number";
            this.element.addEventListener("change", () => this.notifyChange());
            this.value = 0;
        }
        get value() {
            return this.element.valueAsNumber || 0;
        }
        set value(value) {
            this.element.valueAsNumber = Number(value) || 0;
        }
    }

    class TableGroup extends CommonControl {
        displayMode = "block";
        constructor(arg0, arg1) {
            let name = "";
            if (typeof arg0 == "string") {
                name = arg0;
            }
            let children = [];
            if (Array.isArray(arg0)) {
                children = arg0;
            }
            else if (Array.isArray(arg1)) {
                children = arg1;
            }
            super(document.createElement("table"), name, children);
            this.element.classList.add("table-group");
            for (let child of this.children) {
                let row = document.createElement("tr");
                let col = document.createElement("td");
                if (child.displayMode == "block") {
                    col.colSpan = 2;
                    row.append(col);
                }
                else {
                    let lbl = document.createElement("td");
                    lbl.innerText = child.hideName ? "" : child.name;
                    row.append(lbl, col);
                }
                col.append(child.element);
                this.element.append(row);
            }
        }
        get value() {
            let value = {};
            for (let child of this.children) {
                if (child.name && !child.hideName) {
                    value[child.name] = child.value;
                }
            }
            return value;
        }
        set value(value) {
            if (typeof value != "object" || value == null) {
                value = {};
            }
            for (let child of this.children) {
                if (child.name && !child.hideName) {
                    child.value = value[child.name];
                }
            }
        }
    }

    class TextArea extends CommonControl {
        constructor(name) {
            super(document.createElement("textarea"), name);
            this.element.addEventListener("change", () => this.notifyChange());
        }
        get value() {
            return this.element.value;
        }
        set value(value) {
            this.element.value = value || "";
        }
    }

    class TextBox extends CommonControl {
        constructor(name) {
            super(document.createElement("input"), name);
            this.element.addEventListener("change", () => this.notifyChange());
        }
        get value() {
            return this.element.value;
        }
        set value(value) {
            this.element.value = value || "";
        }
    }

    function createForm() {
        return new TableGroup([
            new ListGroup("creatures", new TableGroup([
                new TextBox("id"),
                new TextBox("name"),
                new TextArea("description"),
                // new Button("Test Description"),
                // new TextOutput(),
                new ListGroup("sprites", new TextBox(), item => item),
                new NumericBox("width"),
                new NumericBox("height"),
                new CheckBox("canFly"),
                new NumericBox("healthMin"),
                new NumericBox("healthMax"),
                new NumericBox("damageMin"),
                new NumericBox("damageMax")
            ]), item => item["id"]),
            new ListGroup("tiles", new TableGroup([
                new TextBox("id"),
                new TextBox("name"),
                new TextArea("description"),
                // new Button("Test Description"),
                // new TextOutput(),
                new ListGroup("sprites", new TextBox(), item => item),
                new CheckBox("isOpaque"),
                new CheckBox("isSolid")
            ]), item => item["id"]),
            new ListGroup("spriteSheets", new TableGroup([
                new TextBox("imageName"),
                new NumericBox("spriteWidth"),
                new NumericBox("spriteHeight"),
                new ListGroup("spriteIds", new TextBox(), item => item)
            ]), item => item["imageName"]),
            new ListGroup("worlds", new TableGroup([
                new TextBox("id"),
                new TextBox("name"),
                new ListGroup("tilePalette", new TextBox(), item => item),
                new NumericBox("chunkWidth"),
                new NumericBox("chunkHeight"),
                new ListGroup("chunks", new TableGroup([
                    new NumericBox("x"),
                    new NumericBox("y"),
                    new TextBox("data")
                ]), item => item["x"] + "," + item["y"]),
                new ListGroup("spawns", new TableGroup([
                    new TextBox("creatureId"),
                    new NumericBox("x"),
                    new NumericBox("y"),
                    new NumericBox("chanceDay"),
                    new NumericBox("chanceNight")
                ]), item => item["x"] + "," + item["y"] + ": " + item["creatureId"])
            ]), item => item["id"])
        ]);
    }

    function transformDataIn(data) {
        data = JSON.parse(JSON.stringify(data));
        if (typeof data == "object" && data != null) {
            if (Array.isArray(data.creatures)) {
                data.creatures.forEach(creature => {
                    if (typeof creature == "object" && creature != null && Array.isArray(creature.health)) {
                        creature.healthMin = creature.health[0];
                        creature.healthMax = creature.health[1];
                        delete creature.health;
                    }
                    if (typeof creature == "object" && creature != null && Array.isArray(creature.damage)) {
                        creature.damageMin = creature.damage[0];
                        creature.damageMax = creature.damage[1];
                        delete creature.damage;
                    }
                });
            }
            if (Array.isArray(data.world)) {
                data.worlds.forEach(world => {
                    if (typeof world == "object" && world != null && Array.isArray(world.chunks)) {
                        world.chunks.forEach(chunk => {
                            if (typeof chunk == "object" && chunk != null && Array.isArray(chunk.data)) {
                                chunk.data = chunk.data.join(",");
                            }
                        });
                    }
                });
            }
        }
        return data;
    }
    function transformDataOut(data) {
        data = JSON.parse(JSON.stringify(data));
        data.creatures.forEach(creature => {
            creature.health = [creature.healthMin, creature.healthMax];
            delete creature.healthMin;
            delete creature.healthMax;
            creature.damage = [creature.damageMin, creature.damageMax];
            delete creature.damageMin;
            delete creature.damageMax;
        });
        data.worlds.forEach(world => {
            const chunkDataSize = world.chunkWidth * world.chunkHeight;
            world.chunks.forEach(chunk => {
                chunk.data = chunk.data.split(",");
                chunk.data.length = chunkDataSize;
                for (let i = 0; i < chunkDataSize; ++i) {
                    chunk.data[i] = Number(chunk.data[i]) || 0;
                }
            });
        });
        return data;
    }

    async function openContentFile() {
        let handle = (await showOpenFilePicker({ types: [{ accept: { "application/json": ".json" } }] }))[0];
        let file = await handle.getFile();
        let text = await file.text();
        let json = JSON.parse(text);
        json = transformDataIn(json);
        return { handle, json };
    }
    async function newContentFile() {
        let handle = await showSaveFilePicker({ types: [{ accept: { "application/json": ".json" } }] });
        let writable = await handle.createWritable();
        writable.write("{}");
        writable.close();
        return { handle, json: {} };
    }
    async function saveContentFile(handle, json) {
        json = transformDataOut(json);
        let text = JSON.stringify(json);
        let writeable = await handle.createWritable();
        await writeable.write(text);
        await writeable.close();
    }

    class Observer extends CommonControl {
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

    var Cloak = {
        changes: false,
        async newContentFile() {
            const { handle, json } = await newContentFile();
            return this.init(handle, json);
        },
        async openContentFile() {
            const { handle, json } = await openContentFile();
            return this.init(handle, json);
        },
        init(handle, json) {
            let form = createForm();
            new Observer(form, () => this.mark());
            form.value = json;
            document.getElementById("extension-list").hidden = true;
            document.getElementById("property-editor").hidden = false;
            document.getElementById("property-editor-title").innerText = handle.name;
            document.getElementById("property-editor-body").append(form.element);
            window.addEventListener("keydown", ev => {
                if (ev.code == "KeyS" && ev.ctrlKey) {
                    ev.preventDefault();
                    ev.stopImmediatePropagation();
                    document.querySelector(":focus").blur();
                    saveContentFile(handle, form.value).then(() => this.unmark());
                }
            });
            window.addEventListener("beforeunload", ev => {
                if (this.changes) {
                    ev.preventDefault();
                    return ev.returnValue = "Are you sure you want to exit?";
                }
            });
        },
        mark() {
            this.changes = true;
            document.getElementById("property-editor-title").classList.add("marked");
        },
        unmark() {
            this.changes = false;
            document.getElementById("property-editor-title").classList.remove("marked");
        }
    };

    var index = { Cloak };

    return index;

})();

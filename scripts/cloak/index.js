define(["require", "exports", "../control-kit/collections/indexed-collection", "../control-kit/collections/keyed-collection", "../control-kit/controls/text-control", "../control-kit/controls/multiline-text-control", "../control-kit/controls/number-control", "../control-kit/controls/checkbox-control", "../control-kit/controls/button-control", "../control-kit/controls/hidden-control"], function (require, exports, indexed_collection_1, keyed_collection_1, text_control_1, multiline_text_control_1, number_control_1, checkbox_control_1, button_control_1, hidden_control_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const openFileBtn = document.getElementById("openFileBtn");
    const saveFileBtn = document.getElementById("saveFileBtn");
    const form = new keyed_collection_1.default()
        .pushBlock(new indexed_collection_1.default(new keyed_collection_1.default()
        .push(new text_control_1.default("id"))
        .push(new text_control_1.default("name"))
        .push(new multiline_text_control_1.default("description"))
        .push(new button_control_1.default("Preview", function () { }))
        .push(new multiline_text_control_1.default("sprites"))
        .push(new number_control_1.default("width"))
        .push(new number_control_1.default("height"))
        .push(new checkbox_control_1.default("canFly"))
        .push(new number_control_1.default("healthMin"))
        .push(new number_control_1.default("healthMax"))
        .push(new number_control_1.default("damageMin"))
        .push(new number_control_1.default("damageMax")), "creatures"))
        .pushBlock(new indexed_collection_1.default(new keyed_collection_1.default()
        .push(new text_control_1.default("id"))
        .push(new text_control_1.default("name"))
        .push(new multiline_text_control_1.default("description"))
        .push(new button_control_1.default("Preview", function () { }))
        .push(new multiline_text_control_1.default("sprites"))
        .push(new checkbox_control_1.default("isOpaque"))
        .push(new checkbox_control_1.default("isSolid")), "tiles"))
        .pushBlock(new indexed_collection_1.default(new keyed_collection_1.default()
        .push(new text_control_1.default("imageName"))
        .push(new number_control_1.default("spriteWidth"))
        .push(new number_control_1.default("spriteHeight"))
        .push(new multiline_text_control_1.default("spriteIds")), "spriteSheets"))
        .pushHidden(new hidden_control_1.default("worlds"))
        .pushBlock(new indexed_collection_1.default(new keyed_collection_1.default()
        .push(new text_control_1.default("id"))
        .pushBlock(new indexed_collection_1.default(new keyed_collection_1.default()
        .push(new number_control_1.default("weight"))
        .push(new multiline_text_control_1.default("value")), "replacers")), "descriptors"));
    form.setValue(null);
    let currentHandle = null;
    document.body.append(form.getElement());
    openFileBtn.addEventListener("pointerdown", async function () {
        if (this.disabled) {
            return;
        }
        // Let the user pick a file and read its contents as JSON
        let handle = (await showOpenFilePicker())[0];
        let blob = await handle.getFile();
        let text = await blob.text();
        let json = JSON.parse(text);
        // Process the input data
        json.creatures.forEach(creature => {
            creature.sprites = creature.sprites.join("\n");
            creature.healthMin = creature.health[0];
            creature.healthMax = creature.health[1];
            creature.damageMin = creature.damage[0];
            creature.damageMax = creature.damage[1];
            delete creature.health;
            delete creature.damage;
        });
        json.tiles.forEach(tile => {
            tile.sprites = tile.sprites.join("\n");
        });
        json.spriteSheets.forEach(spriteSheet => {
            spriteSheet.spriteIds = spriteSheet.spriteIds.join("\n");
        });
        // Init the editor
        form.setValue(json);
        currentHandle = handle;
        this.disabled = true;
    });
    saveFileBtn.addEventListener("pointerdown", async function () {
        if (this.disabled) {
            return;
        }
        let json = form.getValue();
        // Process the output data
        json.creatures.forEach(creature => {
            creature.sprites = creature.sprites.split("\n").filter(s => s);
            creature.health = [creature.healthMin ?? 0, creature.healthMax ?? 0];
            creature.damage = [creature.damageMin ?? 0, creature.damageMax ?? 0];
            delete creature.healthMin;
            delete creature.healthMax;
            delete creature.damageMin;
            delete creature.damageMax;
        });
        json.tiles.forEach(tile => {
            tile.sprites = tile.sprites.split("\n").filter(s => s);
        });
        json.spriteSheets.forEach(spriteSheet => {
            spriteSheet.spriteIds = spriteSheet.spriteIds.split("\n").filter(s => s);
        });
        // Convert the JSON to a string and write it to the file
        let text = JSON.stringify(json);
        let writable = await currentHandle.createWritable();
        writable.write(text);
        writable.close();
        this.disabled = true;
    });
    document.addEventListener("change", function (event) {
        saveFileBtn.disabled = false;
    });
    document.addEventListener("keydown", function (event) {
        if (event.code == "KeyS" && event.ctrlKey) {
            // Don't use the browser's default save handler
            event.preventDefault();
            event.stopImmediatePropagation();
            // Click the saveFileBtn button
            document.getElementById("saveFileBtn").dispatchEvent(new PointerEvent("pointerdown"));
        }
    });
    window.addEventListener("beforeunload", function (event) {
        if (!saveFileBtn.disabled) {
            event.preventDefault();
            return event.returnValue = "";
        }
    });
});
//# sourceMappingURL=index.js.map
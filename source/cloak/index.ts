import IndexedCollection from "../control-kit/collections/indexed-collection";
import KeyedCollection from "../control-kit/collections/keyed-collection";
import TextControl from "../control-kit/controls/text-control";
import MultilineTextControl from "../control-kit/controls/multiline-text-control";
import NumberControl from "../control-kit/controls/number-control";
import CheckboxControl from "../control-kit/controls/checkbox-control";
import ButtonControl from "../control-kit/controls/button-control";
import HiddenControl from "../control-kit/controls/hidden-control";

const openFileBtn = <HTMLButtonElement> document.getElementById("openFileBtn");
const saveFileBtn = <HTMLButtonElement> document.getElementById("saveFileBtn");

const form =
  new KeyedCollection()
    .pushBlock(new IndexedCollection<KeyedCollection, {}>(new KeyedCollection()
      .push(new TextControl("id"))
      .push(new TextControl("name"))
      .push(new MultilineTextControl("description"))
      .push(new ButtonControl("Preview", function () {}))
      .push(new MultilineTextControl("sprites"))
      .push(new NumberControl("width"))
      .push(new NumberControl("height"))
      .push(new CheckboxControl("canFly"))
      .push(new NumberControl ("healthMin"))
      .push(new NumberControl ("healthMax"))
      .push(new NumberControl ("damageMin"))
      .push(new NumberControl ("damageMax"))
    , "creatures"))
    .pushBlock(new IndexedCollection<KeyedCollection, {}>(new KeyedCollection()
      .push(new TextControl("id"))
      .push(new TextControl("name"))
      .push(new MultilineTextControl("description"))
      .push(new ButtonControl("Preview", function () {}))
      .push(new MultilineTextControl("sprites"))
      .push(new CheckboxControl("isOpaque"))
      .push(new CheckboxControl("isSolid"))
    , "tiles"))
    .pushBlock(new IndexedCollection<KeyedCollection, {}>(new KeyedCollection()
      .push(new TextControl("imageName"))
      .push(new NumberControl("spriteWidth"))
      .push(new NumberControl("spriteHeight"))
      .push(new MultilineTextControl("spriteIds"))
    , "spriteSheets"))
    .pushHidden(new HiddenControl("worlds"))
    .pushBlock(new IndexedCollection<KeyedCollection, {}>(new KeyedCollection()
      .push(new TextControl("id"))
      .pushBlock(new IndexedCollection<KeyedCollection, {}>(new KeyedCollection()
        .push(new NumberControl("weight"))
        .push(new MultilineTextControl("value"))
      , "replacers"))
    , "descriptors"));

form.setValue(null);

let currentHandle: FileSystemFileHandle = null;

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

  let json = <any> form.getValue();

  // Process the output data
  json.creatures.forEach(creature => {
    creature.sprites = creature.sprites.split("\n").filter(s => s);

    creature.health = [ creature.healthMin ?? 0, creature.healthMax ?? 0 ];
    creature.damage = [ creature.damageMin ?? 0, creature.damageMax ?? 0 ];

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
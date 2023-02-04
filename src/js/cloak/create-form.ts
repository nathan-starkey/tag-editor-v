import Button from "../common-controls/src/common-controls/button";
import CheckBox from "../common-controls/src/common-controls/check-box";
import ListGroup from "../common-controls/src/common-controls/list-group";
import NumericBox from "../common-controls/src/common-controls/numeric-box";
import TableGroup from "../common-controls/src/common-controls/table-group";
import TextArea from "../common-controls/src/common-controls/text-area";
import TextBox from "../common-controls/src/common-controls/text-box";
import TextOutput from "../common-controls/src/common-controls/text-output";

let cachedDescriptors: {}[];
let descriptorListGroup: ListGroup<{}>;
let creatureDescriptionInput: TextArea;
let creatureDescriptionOutput: TextOutput;
let tileDescriptionInput: TextArea;
let tileDescriptionOutput: TextOutput;

export function createForm() {
  setTimeout(() => {
    [
      creatureDescriptionOutput,
      tileDescriptionOutput
    ].forEach(descriptionOutput => {
      descriptionOutput.element.style.display = "inline-block";
      descriptionOutput.element.style.width = "256px";
      descriptionOutput.element.style.fontSize = "12px";
    });
  }, 0);

  return new TableGroup([
    new ListGroup("creatures", new TableGroup([
      new TextBox("id"),
      new TextBox("name"),
      creatureDescriptionInput = new TextArea("description"),
      new Button("Test Description", () => {
        cachedDescriptors = descriptorListGroup.value;
        creatureDescriptionOutput.text = generateDescription(creatureDescriptionInput.value);
      }),
      creatureDescriptionOutput = new TextOutput(),
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
      tileDescriptionInput = new TextArea("description"),
      new Button("Test Description", () => {
        cachedDescriptors = descriptorListGroup.value;
        tileDescriptionOutput.text = generateDescription(tileDescriptionInput.value);
      }),
      tileDescriptionOutput = new TextOutput(),
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
    ]), item => item["id"]),
    descriptorListGroup = new ListGroup("descriptors", new TableGroup([
      new TextBox("id"),
      new ListGroup("replacers", new TableGroup([
        new NumericBox("weight"),
        new TextArea("value")
      ]))
    ]))
  ]);
}

function generateDescription(inputText: string): string {
  let outputText = "";
  let lastOpenIndex = -1;
  let lastCloseIndex = -1;

  let curr = 0;
  let max = 100;

  while (true) {
    if (curr++ == max) break;

    // text segment
    let nextOpenIndex = inputText.indexOf("<", lastCloseIndex + 1);
    let nextCloseIndex = inputText.indexOf(">", nextOpenIndex + 1);
  
    if (nextOpenIndex == -1) {
      outputText += inputText.slice(lastCloseIndex + 1);
      break;
    }
    
    outputText += inputText.slice(lastCloseIndex + 1, nextOpenIndex);
  
    // descriptor segment
    outputText += resolveDescriptor(inputText.slice(nextOpenIndex + 1, nextCloseIndex));

    lastOpenIndex = nextOpenIndex;
    lastCloseIndex = nextCloseIndex;
  }

  return outputText;
}

function resolveDescriptor(id: string) {
  // TEMP
  id = id.indexOf(":") != -1 ? id.split(":")[0] : id;

  let descriptors = cachedDescriptors;
  let descriptor = descriptors.find(descriptor => descriptor["id"] == id);;

  if (!descriptor) {
    return "<" + id + ">";
  }

  let replacer = descriptor["replacers"][Math.floor(Math.random() * descriptor["replacers"].length)];

  if (!replacer) {
    return "undefined";
  }

  return generateDescription(replacer.value);
}
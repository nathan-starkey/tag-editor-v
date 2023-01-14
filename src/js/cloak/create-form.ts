import Button from "../common-controls/src/common-controls/button";
import CheckBox from "../common-controls/src/common-controls/check-box";
import ListGroup from "../common-controls/src/common-controls/list-group";
import NumericBox from "../common-controls/src/common-controls/numeric-box";
import TableGroup from "../common-controls/src/common-controls/table-group";
import TextArea from "../common-controls/src/common-controls/text-area";
import TextBox from "../common-controls/src/common-controls/text-box";
import TextOutput from "../common-controls/src/common-controls/text-output";

export function createForm() {
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
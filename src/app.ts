/// <reference path="widget-ts/src/index.ts" />

const Widgets = TagEditor.Widgets;

const root = new Widgets.Array("creatures", new Widgets.Struct("", [
  new Widgets.String("id"),
  new Widgets.String("name"),
  new Widgets.String("description", true),
  new Widgets.Number("width"),
  new Widgets.Number("height"),
  new Widgets.Boolean("canFly"),
  new Widgets.Enum("type", ["creature", "npc", "player"]),
  new Widgets.Bitmask("flags", ["doesNotMove", "doesNotInteract", "indestructible"]),
  new Widgets.Array("sprites", new Widgets.String(""))
]));

document.body.append(root.getElement());
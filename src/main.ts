/// <reference path="widget-ts/src/index.ts" />

function main() {
  let root = new Widgets.Array("creatures", new Widgets.Struct("", [
    new Widgets.String("id"),
    new Widgets.String("name"),
    new Widgets.String("description", true),
    new Widgets.Number("width"),
    new Widgets.Number("height"),
    new Widgets.Range("health"),
    new Widgets.Range("damage"),
    new Widgets.Array("sprites", new Widgets.String(""))
  ]));

  document.body.append(root.getElement());
}

main();
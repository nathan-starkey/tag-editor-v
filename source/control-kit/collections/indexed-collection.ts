import Control from "../control";
import IndexedCollectionBase from "./indexed-collection-base";
import KeyedCollection from "./keyed-collection";

export default class IndexedCollection<T extends Control<U>, U> extends IndexedCollectionBase<T, U> {
  public container = document.createElement("div");
  public header = document.createElement("div");
  public body = document.createElement("div");
  public label = document.createElement("span");
  public select = document.createElement("select");
  public appendButton = document.createElement("button");
  public insertButton = document.createElement("button");
  public deleteButton = document.createElement("button");
  public moveUpButton = document.createElement("button");
  public moveDownButton = document.createElement("button");

  constructor(control: T, name: string = "") {
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

  public getElement(): HTMLElement {
    return this.container;
  }

  public render(index: number): void {
    let isKeyedCollection = this.control instanceof KeyedCollection;

    this.select.innerHTML = "";

    for (let item of this.items) {
      let name: string;

      if (isKeyedCollection) {
        name = item ? String(Object.values(<{}> item)[0]) : "NULL | UNDEFINED";
      } else {
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

  public setValue(value: any): void {
    super.setValue(value);

    this.appendButton.disabled = value === null;
  }

  public append(): void {
    super.append();

    this.appendButton.dispatchEvent(new Event("change", { bubbles: true }));
  }

  public insert(): boolean {
    if (super.insert()) {
      this.insertButton.dispatchEvent(new Event("change", { bubbles: true }));

      return true;
    }

    return false;
  }

  public delete(): boolean {
    if (super.delete()) {
      this.deleteButton.dispatchEvent(new Event("change", { bubbles: true }));

      return true;
    }

    return false;
  }

  public move(to: number): boolean {
    if (super.move(to)) {
      this.moveUpButton.dispatchEvent(new Event("change", { bubbles: true }));

      return true;
    }

    return false;
  }
}
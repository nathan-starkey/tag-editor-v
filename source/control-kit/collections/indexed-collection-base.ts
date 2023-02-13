import Control from "../control";

export default abstract class IndexedCollectionBase<T extends Control<U>, U> implements Control<U[]> {
  public name: string;
  public control: T;
  public items: U[] = [];
  public index: number = -1;

  constructor(control: T, name: string = "") {
    this.control = control;
    this.name = name;

    control.setValue(null);
  }

  public abstract getElement(): HTMLElement;
  
  public abstract render(index: number): void;

  protected store() {
    if (this.index == -1) {
      return;
    }

    this.items[this.index] = this.control.getValue();
  }

  public setValue(value: any): void {
    this.items = [];
    this.index = -1;
    this.control.setValue(null);

    if (!Array.isArray(value)) {
      value = [];
    }

    for (let i = 0; i < value.length; ++i) {
      this.control.setValue(value[i]);
      this.items.push(this.control.getValue());
    }

    this.render(this.items.length - 1);
  }

  public getValue(): U[] {
    this.store();
    
    return Array.from(this.items);
  }

  public append() {
    this.store();
    this.control.setValue(undefined);
    this.items.push(this.control.getValue());
    this.render(this.items.length - 1);
  }

  public insert(): boolean {
    if (this.index == -1) {
      return false;
    }

    this.store();
    this.control.setValue(undefined);
    this.items.splice(this.index, 0, this.control.getValue());
    this.render(this.index);

    return true;
  }

  public delete(): boolean {
    if (this.index == -1) {
      return false;
    }

    let index = this.index;

    if (this.index == this.items.length - 1) {
      --this.index;
    }

    this.items.splice(index, 1);

    if (this.index == -1) {
      this.control.setValue(null);
    } else {
      this.control.setValue(this.items[this.index]);
    }

    this.render(this.index);

    return true;
  }

  public move(to: number): boolean {
    if (this.index == -1) {
      return false;
    }

    this.store();

    let from = this.index;
    let item = this.items[from];

    this.items[from] = this.items[to];
    this.items[to] = item;

    this.render(to);

    return true;
  }
}
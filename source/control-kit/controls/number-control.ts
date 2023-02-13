import Control from "../control";

export default class NumberControl implements Control<number> {
  public name: string;
  
  private element = document.createElement("input");

  constructor(name: string = "") {
    this.name = name;
    this.element.type = "number";
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public setValue(value: any): void {
    this.element.value = Number.isNaN(value) ? "" : value ?? "";
    this.element.disabled = value === null;
  }
  
  public getValue(): number {
    return this.element.valueAsNumber;
  }
}
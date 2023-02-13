import Control from "../control";

export default class TextControl implements Control<string> {
  public name: string;

  private element = document.createElement("input");

  constructor(name: string = "") {
    this.name = name;
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public setValue(value: any): void {
    this.element.value = value ?? "";
    this.element.disabled = value === null;
  }
  
  public getValue(): string {
    return this.element.value;
  }
}
import Control from "../control";

export default class MultilineTextControl implements Control<string> {
  public name: string;

  private element = document.createElement("textarea");

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
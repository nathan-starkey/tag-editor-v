import Control from "../control";

export default class CheckboxControl implements Control<boolean> {
  public name: string;
  
  private element = document.createElement("input");

  constructor(name: string = "") {
    this.name = name;
    this.element.type = "checkbox";
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public setValue(value: any): void {
    this.element.checked = value;
    this.element.disabled = value === null;
  }
  
  public getValue(): boolean {
    return this.element.checked;
  }
}
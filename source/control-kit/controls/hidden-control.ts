import Control from "../control";

export default class HiddenControl<T = any> implements Control<T> {
  public name: string;
  
  private value: any;
  private element = document.createElement("span");

  constructor(name: string = "") {
    this.name = name;
    
    this.element.innerText = "Hidden";
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public setValue(value: any): void {
    this.value = value;
  }
  
  public getValue(): T {
    return this.value;
  }
}
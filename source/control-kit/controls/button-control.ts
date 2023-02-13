import Control from "../control";

export default class ButtonControl implements Control<null> {
  public name: string = "";

  public container = document.createElement("div");
  public button = document.createElement("button");
  public message = document.createElement("div");

  constructor(label: string, callback: (this: ButtonControl) => void) {
    this.button.innerText = label;
    this.button.addEventListener("pointerdown", () => this.button.disabled || callback.call(this));

    this.container.append(this.button, this.message);
  }

  public getElement(): HTMLElement {
    return this.container;
  }

  public setValue(value: any): void {
    this.button.disabled = value === null;
    this.message.innerText = "";
  }
  
  public getValue(): null {
    return null;
  }

  public output(message: string): void {
    this.message.innerText = message;
  }
}
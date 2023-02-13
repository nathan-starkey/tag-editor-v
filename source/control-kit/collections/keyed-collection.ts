import Control from "../control";

export default class KeyedCollection implements Control<{}> {
  public name: string;
  public controls: Control<any>[] = [];
  public namedControls: { [name: string]: Control<any> } = {};

  private table = document.createElement("table");
  private tbody = document.createElement("tbody");

  constructor(name: string = "") {
    this.name = name;
    
    this.table.classList.add("keyed-collection");

    this.table.append(this.tbody);
  }

  public getElement(): HTMLElement {
    return this.table;
  }

  public push(control: Control<any>, display: "inline" | "block" | "hidden" = "inline"): this {
    this.controls.push(control);

    control.setValue(undefined);
    
    if (control.name) {
      this.namedControls[control.name] = control;
    }

    if (display == "inline") {
      let tr = document.createElement("tr");
      let td0 = document.createElement("td");
      let td1 = document.createElement("td");

      td0.innerText = control.name;
      td1.append(control.getElement());

      tr.append(td0, td1);
      this.tbody.append(tr);
    } else if (display == "block") {
      let tr = document.createElement("tr");
      let td = document.createElement("td");

      td.colSpan = 2;
      td.append(control.getElement());
      
      tr.append(td);
      this.tbody.append(tr);
    }

    return this;
  }

  public pushBlock(control: Control<any>): this {
    return this.push(control, "block");
  }

  public pushHidden(control: Control<any>): this {
    return this.push(control, "hidden");
  }

  public setValue(value: any): void {
    if (typeof value != "object") {
      value = {};
    }

    for (let control of this.controls) {
      control.setValue(value === null ? null : value[control.name]);
    }
  }

  public getValue(): {} {
    let value = {};

    for (let control of this.controls) {
      if (control.name) {
        value[control.name] = control.getValue();
      }
    }

    return value;
  }
}
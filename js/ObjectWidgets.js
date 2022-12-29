class StructWidget extends StructWidgetBase {
  constructor(name, children) {
    super(name, children);

    this.element = document.createElement("table");
    this.element.classList.add("te-struct-block");

    for (let widget of children) {
      let row = document.createElement("tr");
      let cellA = document.createElement("td");
      let cellB = document.createElement("td");

      cellA.classList.add("te-struct-block-label");
      cellB.classList.add("te-struct-block-child");
  
      cellA.innerText = widget.name;
      cellB.appendChild(widget.getElement());

      if (widget.doNotLabel) {
        cellB.colSpan = 2;
        row.append(cellB);
      } else {
        row.append(cellA, cellB);
      }

      this.element.append(row);
    }
  }

  getElement() {
    return this.element;
  }

  setIsDisabled(isDisabled) {
    super.setIsDisabled(isDisabled);

    if (isDisabled) {
      this.element.classList.add("disabled");
    } else {
      this.element.classList.remove("disabled");
    }
  }
}


class ArrayWidget extends ArrayWidgetBase {
  constructor(name, child, namingFn) {
    super(name, child);

    this.doNotLabel = true;
    this.namingFn = namingFn;

    let [element, header, label, select, btnAdd, btnRemove, btnMoveUp, btnMoveDown, body] = parseElements(`
      <div class="te-array-block">
        <div class="te-array-block-header">
          <label>${escapeText(this.name)}</label>
          <select class="te-form-control"></select>
          <button class="te-form-control">Add</button>
          <button class="te-form-control">Remove</button>
          <button class="te-form-control">&#9650;</button>
          <button class="te-form-control">&#9660;</button>
        </div>
        <div class="te-array-block-body"></div>
      </div>
    `);

    body.append(child.getElement());

    this.element = element;
    this.select = select;
    this.btnAdd = btnAdd;
    this.btnRemove = btnRemove;
    this.btnMoveUp = btnMoveUp;
    this.btnMoveDown = btnMoveDown;

    label.addEventListener("click", () => {
      element.classList.toggle("collapsed");
    });

    select.addEventListener("input", () => {
      this.setIndex(this.select.selectedIndex);
    });

    btnAdd.addEventListener("click", () => {
      this.add();
    });

    btnRemove.addEventListener("click", () => {
      this.remove();
    });

    btnMoveUp.addEventListener("click", () => {
      this.move(-1);
    });

    btnMoveDown.addEventListener("click", () => {
      this.move(1);
    });

    this.update();
  }

  getElement() {
    return this.element;
  }

  setIsDisabled(isDisabled) {
    super.setIsDisabled(isDisabled);

    this.select.disabled = isDisabled || this.value.length == 0;
    this.btnAdd.disabled = isDisabled;
  }

  setIndex(index) {
    super.setIndex(index);

    this.update();
  }

  update() {
    super.update();
    
    this.select.innerHTML = "";

    let value = this.getValue();

    for (let i = 0; i < value.length; ++i) {
      let name = this.namingFn ? this.namingFn.call(this, value[i]) : this.child instanceof ParentWidget ? Object.values(value[i])[0] : value[i];

      if (Array.isArray(name)) {
        name = `Array (${name.length})`;
      } else if (typeof name == "object") {
        name = "Object";
      } else if (name == undefined) {
        name = "Empty";
      } else {
        name = String(name);
      }

      this.select.options.add(new Option(`${name}`));
    }

    this.select.selectedIndex = this.index;

    let nothingEntered = this.value.length == 0;
    let nothingSelected = this.index == -1;

    this.select.disabled = nothingEntered;
    this.btnRemove.disabled = nothingSelected;
    this.btnMoveUp.disabled = nothingSelected || this.index == 0;
    this.btnMoveDown.disabled = nothingSelected || this.index == this.value.length - 1;
    this.child.setIsDisabled(nothingSelected);
  }
}


parseElements._temp = document.createElement("div");


function parseElements(string) {
  parseElements._temp.innerHTML = string;

  return Array.from(parseElements._temp.querySelectorAll("*"));
}


function escapeText(text) {
  parseElements._temp.innerText = text;

  return parseElements._temp.innerHTML;
}
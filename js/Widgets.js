class Widget {
  constructor(name) {
    this.name = name;
    this.parent = null;
  }

  setValue(value) {
  }

  getValue() {
    return undefined;
  }

  getElement() {
    return undefined;
  }

  setIsDisabled(isDisabled) {
  }

  getIsDisabled() {
    return false;
  }

  update() {
    if (this.parent) this.parent.update();
  }
}


class ParentWidget extends Widget {
  constructor(name, children) {
    super(name);

    this.children = children;

    for (let widget of children) widget.parent = this;
  }
}


class StructWidgetBase extends ParentWidget {
  isDisabled = false;

  getValue() {
    return Object.fromEntries(this.children.map(widget => [widget.name, widget.getValue()]));
  }

  setValue(value) {
    value = value || {};
    this.children.forEach(widget => widget.setValue(value[widget.name]));
  }

  getIsDisabled() {
    return this.isDisabled;
  }

  setIsDisabled(isDisabled) {
    this.isDisabled = isDisabled;
    this.children.forEach(widget => widget.setIsDisabled(isDisabled));
  }
}


class ArrayWidgetBase extends Widget {
  constructor(name, child) {
    super(name);

    this.child = child;
    this.value = [];
    this.index = -1;
    this.isDisabled = false;

    child.parent = this;
  }

  setValue(value) {
    this.child.setValue(undefined);
    this.index = -1;
    this.value = [];

    for (let childValue of (value || [])) {
      this.add();
      this.child.setValue(childValue);
    }

    this.update();
  }

  getValue() {
    if (this.index != -1) {
      this.value[this.index] = this.child.getValue();
    }

    return Array.from(this.value);
  }

  setIsDisabled(isDisabled) {
    this.isDisabled = isDisabled;
    this.child.setIsDisabled(isDisabled || this.index == -1);
  }

  getIsDisabled() {
    return this.isDisabled;
  }

  setIndex(index) {
    if (index < -1) return;
    if (index >= this.value.length) return;

    if (this.index != -1) {
      this.value[this.index] = this.child.getValue();
    }

    this.index = index;

    if (this.index == -1) {
      this.child.setIsDisabled(true);
      this.child.setValue(undefined);
    } else {
      this.child.setIsDisabled(false);
      this.child.setValue(this.value[this.index]);
    }
  }

  getIndex() {
    return this.index;
  }

  add() {
    this.value.push(undefined);
    this.setIndex(this.value.length - 1);
    this.update();
  }

  remove() {
    if (this.index == -1) return;

    let index = this.index;
    let isLastItem = this.index == this.value.length - 1;

    if (isLastItem) {
      this.setIndex(index - 1);
    } else {
      this.setIndex(index + 1);
      --this.index;
    }

    this.value.splice(index, 1);

    this.update();
  }

  move(offset) {
    let index = this.index + offset;

    if (offset == 0) return;
    if (index == -1) return;
    if (index == this.value.length) return;

    let a = this.value[this.index];
    let b = this.value[index];

    this.value[this.index] = b;
    this.value[index] = a;
    this.index = index;

    this.update();
  }
}
class PrimitiveWidgetBase extends Widget {
  constructor(name, type, subtype) {
    super(name);

    this.element = document.createElement(type);
    this.element.classList.add("te-form-control");

    if (subtype) {
      this.element.type = subtype;
    }

    this.element.addEventListener("change", () => {
      this.update();
    });
  }

  setValue(value) {
    this.element.value = value;
  }

  getValue() {
    return this.element.value;
  }

  getElement() {
    return this.element;
  }

  setIsDisabled(isDisabled) {
    this.element.disabled = isDisabled;
  }

  getIsDisabled() {
    return this.element.disabled;
  }
}


class StringWidget extends PrimitiveWidgetBase {
  constructor(name) {
    super(name, "input", "text");
  }

  setValue(value) {
    super.setValue(String(value || ""));
  }
}


class MLStringWidget extends PrimitiveWidgetBase {
  constructor(name) {
    super(name, "textarea", undefined);
  }

  setValue(value) {
    super.setValue(String(value || ""));
  }
}


class NumberWidget extends PrimitiveWidgetBase {
  constructor(name) {
    super(name, "input", "number");

    this.element.value = 0;
  }

  setValue(value) {
    super.setValue(Number(value) || 0);
  }

  getValue() {
    return this.element.valueAsNumber;
  }
}


class BooleanWidget extends PrimitiveWidgetBase {
  constructor(name) {
    super(name, "input", "checkbox");
  }

  setValue(value) {
    this.element.checked = Boolean(value);
  }

  getValue() {
    return this.element.checked;
  }
}


class EnumWidget extends PrimitiveWidgetBase {
  constructor(name, values) {
    super(name, "select", undefined);

    for (let value of values) {
      this.element.options.add(new Option(value));
    }

    this.element.value = values[0];
    this.values = values;
  }

  setValue(value) {
    if (value == undefined || this.values.includes(value)) {
      super.setValue(value ?? this.values[0]);
    }
  }
}


class ColorWidget extends PrimitiveWidgetBase {
  constructor(name) {
    super(name, "input", "color");
  }
}
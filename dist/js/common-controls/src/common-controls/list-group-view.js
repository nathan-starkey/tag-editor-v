export default class ListGroupView {
    outer = document.createElement("div");
    header = document.createElement("div");
    body = document.createElement("div");
    label = document.createElement("label");
    combo = document.createElement("select");
    buttonAdd = document.createElement("button");
    buttonRemove = document.createElement("button");
    buttonMoveUp = document.createElement("button");
    buttonMoveDown = document.createElement("button");
    constructor(name, select, add, remove, move) {
        this.label.innerText = name;
        this.buttonAdd.innerText = "Add";
        this.buttonRemove.innerText = "Remove";
        this.buttonMoveUp.innerHTML = "&#9650;";
        this.buttonMoveDown.innerHTML = "&#9660;";
        this.outer.classList.add("list-group");
        this.header.append(this.label, this.combo, this.buttonAdd, this.buttonRemove, this.buttonMoveUp, this.buttonMoveDown);
        this.outer.append(this.header, this.body);
        this.label.addEventListener("click", () => this.outer.classList.toggle("collapsed"));
        this.combo.addEventListener("change", () => select(this.combo.selectedIndex));
        this.buttonAdd.addEventListener("click", () => add());
        this.buttonRemove.addEventListener("click", () => remove());
        this.buttonMoveUp.addEventListener("click", () => move(-1));
        this.buttonMoveDown.addEventListener("click", () => move(1));
    }
    render(isDisabled, options, index) {
        this.combo.innerHTML = "";
        for (let option of options) {
            this.combo.options.add(new Option(option));
        }
        this.combo.selectedIndex = index;
        let isEmpty = options.length == 0;
        let isFirst = index == 0;
        let isLast = index == options.length - 1;
        this.combo.disabled = isDisabled || isEmpty;
        this.buttonAdd.disabled = isDisabled;
        this.buttonRemove.disabled = isDisabled || isEmpty;
        this.buttonMoveUp.disabled = isDisabled || isEmpty || isFirst;
        this.buttonMoveDown.disabled = isDisabled || isEmpty || isLast;
    }
}

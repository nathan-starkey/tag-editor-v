class Context {
  constructor(name, widget, save) {
    this.name = name;
    this.widget = widget;
    this.invokeSave = save;
    this.saving = false;
    this.contexts = null;
    
    this.tab = parseElements(`
      <button class="tab"><!--
    --><div class="tab-label">${escapeText(name)}</div><!--
    --><div class="tab-close">&#10005;</div><!--
  --></button>
    `)[0];
    
    this.tab.addEventListener("click", () => {
      this.contexts.select(this);
    });

    this.tab.querySelector(".tab-close").addEventListener("click", (ev) => {
      ev.stopImmediatePropagation();
      this.contexts.remove(this);
    });
    
    widget.parent = this;
  }

  update() {
    this.mark();
  }

  mark() {
    this.tab.classList.add("marked");
  }

  unmark() {
    this.tab.classList.remove("marked");
  }

  async save() {
    if (this.saving) return;

    this.saving = true;

    try {
      await this.invokeSave(this);
      this.unmark();
    } catch (e) {
      console.error(e);
      alert("Unable to save file " + this.name);
    } finally {
      this.saving = false;
    }
  }
}


class Contexts {
  list = [];
  index = -1;

  getCurrentContext() {
    return this.list[this.index];
  }

  add(context) {
    context.contexts = this;
    this.list.push(context);
    this.select(context);
    
    document.getElementById("tabs").append(context.tab);
  }

  remove(context) {
    let index = this.list.indexOf(context);
    if (index == -1) return;
    if (context.tab.classList.contains("marked") && !confirm("Attention: This file may contain unsaved changes. Closing it now will result in those changes being lost. Are you sure you want to continue?")) return;

    context.tab.remove();
    
    if (this.index == 0 && this.list.length != 1) {
      this.select(this.list[this.index + 1]);
      --this.index;
    } else {
      this.select(this.list[this.index - 1]);
    }

    this.list.splice(index, 1);
  }

  select(context) {
    document.querySelector("#tabs>.tab.selected")?.classList.remove("selected");
    document.getElementById("body").innerHTML = "";

    if (context) {
      this.index = this.list.indexOf(context);
      context.tab.classList.add("selected");
      document.getElementById("body").append(context.widget.getElement());
    } else {
      this.index = -1;
    }
  }

  save() {
    this.getCurrentContext()?.save();
  }
}
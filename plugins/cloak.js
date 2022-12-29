const Cloak = {
  async invoke(contexts, open) {
    let handle;
    let value = {};
    
    if (open) {
      handle = (await window.showOpenFilePicker())[0];
      handle.requestPermission({mode: "readwrite"});

      let file = await handle.getFile();
      let text = await file.text();

      value = JSON.parse(text);
    } else {
      handle = await window.showSaveFilePicker();
    }

    let context = new Context(handle.name, this.createWidget(), this.saveContext.bind(this, handle));

    contexts.add(context);

    context.widget.setValue(value);
    context.unmark();
    
    if (!open) context.save();
  },

  createWidget() {
    return new StructWidget(undefined, [
      new ArrayWidget("creatures", new StructWidget(undefined, [
        new StringWidget("id"),
        new StringWidget("name"),
        new MLStringWidget("description"),
        new ArrayWidget("sprites", new StringWidget(undefined)),
        new NumberWidget("width"),
        new NumberWidget("height"),
        new BooleanWidget("canFly"),
        new NumberWidget("healthMin"),
        new NumberWidget("healthMax"),
        new NumberWidget("damageMin"),
        new NumberWidget("damageMax"),
      ])),
      new ArrayWidget("tiles", new StructWidget(undefined, [
        new StringWidget("id"),
        new StringWidget("name"),
        new ArrayWidget("sprites", new StringWidget(undefined)),
        new BooleanWidget("isSolid"),
        new BooleanWidget("isOpaque"),
      ])),
    ]);
  },

  async saveContext(handle, context) {
    let writable = await handle.createWritable();
    writable.write(JSON.stringify(context.widget.getValue()));
    writable.close();
  }
};
var CloakExtension;
(function (CloakExtension) {
    let isMarked = false;
    function transformDataOnImport(json) {
        if (json && typeof json == "object" && Array.isArray(json.worlds)) {
            json.worlds.forEach(world => {
                if (world && typeof world == "object" && Array.isArray(world.chunks)) {
                    world.chunks.forEach(chunk => {
                        if (chunk && typeof chunk == "object" && Array.isArray(chunk.data)) {
                            chunk.data = chunk.data.join(",");
                        }
                    });
                }
            });
        }
    }
    function transformDataOnExport(json) {
        json.worlds.forEach(world => {
            let chunkDataSize = world.chunkWidth * world.chunkHeight;
            world.chunks.forEach(chunk => {
                chunk.data = chunk.data.split(",");
                chunk.data.length = chunkDataSize;
                for (let i = 0; i < chunkDataSize; ++i) {
                    chunk.data[i] = Number(chunk.data[i]) || 0;
                }
            });
        });
    }
    async function openFile() {
        let handles = await window.showOpenFilePicker();
        let handle = handles[0];
        let file = await handle.getFile();
        let text = await file.text();
        let json = JSON.parse(text);
        transformDataOnImport(json);
        init(handle, json);
    }
    CloakExtension.openFile = openFile;
    async function newFile() {
        let handle = await window.showSaveFilePicker();
        let writeable = await handle.createWritable();
        let json = {};
        let text = JSON.stringify(json);
        await writeable.write(text);
        await writeable.close();
        init(handle, json);
    }
    CloakExtension.newFile = newFile;
    function init(handle, initialJSON) {
        let root = createRoot();
        document.getElementById("title").innerText = handle.name;
        document.getElementById("setup").hidden = true;
        document.getElementById("main").hidden = false;
        document.getElementById("main").append(root.getElement());
        root.setValue(initialJSON);
        let observer = new class extends WidgetBase.ParentWidget {
            valueChanged(trace, direct) {
                mark();
            }
        }("", [root]);
        window.addEventListener("keydown", ev => {
            if (ev.code == "KeyS" && ev.ctrlKey) {
                ev.stopImmediatePropagation();
                ev.preventDefault();
                save();
            }
        });
        window.addEventListener("beforeunload", ev => {
            if (isMarked) {
                ev.preventDefault();
            }
            return ev.returnValue = "Are you sure you want to exit?";
        });
        function mark() {
            isMarked = true;
            document.getElementById("title").innerText = "*" + handle.name;
        }
        function unmark() {
            isMarked = false;
            document.getElementById("title").innerText = handle.name;
        }
        async function save() {
            let json = root.getValue();
            transformDataOnExport(json);
            let text = JSON.stringify(json);
            let writeable = await handle.createWritable();
            await writeable.write(text);
            await writeable.close();
            unmark();
        }
    }
    function createRoot() {
        return new Widgets.Struct("", [
            new Widgets.Array("creatures", new Widgets.Struct("", [
                new Widgets.String("id"),
                new Widgets.String("name"),
                new Widgets.String("description", true),
                new Widgets.Array("sprites", new Widgets.String("")),
                new Widgets.Number("width"),
                new Widgets.Number("height"),
                new Widgets.Boolean("canFly"),
                new Widgets.Range("health"),
                new Widgets.Range("damage")
            ])),
            new Widgets.Array("tiles", new Widgets.Struct("", [
                new Widgets.String("id"),
                new Widgets.String("name"),
                new Widgets.Array("sprites", new Widgets.String("")),
                new Widgets.Boolean("isOpaque"),
                new Widgets.Boolean("isSolid")
            ])),
            new Widgets.Array("spriteSheets", new Widgets.Struct("", [
                new Widgets.String("imageName"),
                new Widgets.Number("spriteWidth"),
                new Widgets.Number("spriteHeight"),
                new Widgets.Array("spriteIds", new Widgets.String(""))
            ])),
            new Widgets.Array("worlds", new Widgets.Struct("", [
                new Widgets.String("id"),
                new Widgets.String("name"),
                new Widgets.Number("chunkWidth"),
                new Widgets.Number("chunkHeight"),
                new Widgets.Array("tilePalette", new Widgets.String("")),
                new Widgets.Array("chunks", new Widgets.Struct("", [
                    new Widgets.Number("x"),
                    new Widgets.Number("y"),
                    new Widgets.String("data")
                ]), (chunk) => chunk.x + "," + chunk.y),
                new Widgets.Array("spawns", new Widgets.Struct("", [
                    new Widgets.String("creatureId"),
                    new Widgets.Number("x"),
                    new Widgets.Number("y"),
                    new Widgets.Number("chanceDay"),
                    new Widgets.Number("chanceNight")
                ]))
            ]))
        ]);
    }
})(CloakExtension || (CloakExtension = {}));

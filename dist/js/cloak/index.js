import { createForm } from "./create-form";
import { newContentFile, openContentFile, saveContentFile } from "./file";
import Observer from "../common-controls/src/common-controls/observer";
export default {
    changes: false,
    async newContentFile() {
        const { handle, json } = await newContentFile();
        return this.init(handle, json);
    },
    async openContentFile() {
        const { handle, json } = await openContentFile();
        return this.init(handle, json);
    },
    init(handle, json) {
        let form = createForm();
        new Observer(form, () => this.mark());
        form.value = json;
        document.getElementById("extension-list").hidden = true;
        document.getElementById("property-editor").hidden = false;
        document.getElementById("property-editor-title").innerText = handle.name;
        document.getElementById("property-editor-body").append(form.element);
        window.addEventListener("keydown", ev => {
            if (ev.code == "KeyS" && ev.ctrlKey) {
                ev.preventDefault();
                ev.stopImmediatePropagation();
                document.querySelector(":focus").blur();
                saveContentFile(handle, form.value).then(() => this.unmark());
            }
        });
        window.addEventListener("beforeunload", ev => {
            if (this.changes) {
                ev.preventDefault();
                return ev.returnValue = "Are you sure you want to exit?";
            }
        });
    },
    mark() {
        this.changes = true;
        document.getElementById("property-editor-title").classList.add("marked");
    },
    unmark() {
        this.changes = false;
        document.getElementById("property-editor-title").classList.remove("marked");
    }
};

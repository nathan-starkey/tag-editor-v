import { transformDataIn, transformDataOut } from "./transform-data";
export async function openContentFile() {
    let handle = (await showOpenFilePicker({ types: [{ accept: { "application/json": ".json" } }] }))[0];
    let file = await handle.getFile();
    let text = await file.text();
    let json = JSON.parse(text);
    json = transformDataIn(json);
    return { handle, json };
}
export async function newContentFile() {
    let handle = await showSaveFilePicker({ types: [{ accept: { "application/json": ".json" } }] });
    let writable = await handle.createWritable();
    writable.write("{}");
    writable.close();
    return { handle, json: {} };
}
export async function saveContentFile(handle, json) {
    json = transformDataOut(json);
    let text = JSON.stringify(json);
    let writeable = await handle.createWritable();
    await writeable.write(text);
    await writeable.close();
}

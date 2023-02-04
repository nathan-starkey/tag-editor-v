import Button from "../common-controls/button";
import CheckBox from "../common-controls/check-box";
import ListGroup from "../common-controls/list-group";
import NumericBox from "../common-controls/numeric-box";
import SelectBox from "../common-controls/select-box";
import TextArea from "../common-controls/text-area";
import TextOutput from "../common-controls/text-output";
import TableGroup from "../common-controls/table-group";
import TextBox from "../common-controls/text-box";
import Observer from "../common-controls/observer";
const root = new ListGroup(new TableGroup("n", [
    new TextBox("name"),
    new NumericBox("count"),
    new SelectBox("type", ["option1", "option2", "option3"]),
    new CheckBox("enabled"),
    new TextArea("notes"),
    new ListGroup("palette", new TextBox()),
    new Button("random float", function () {
        let output = root.children.n.children.output;
        output.value = Math.random().toString();
    }),
    new TextOutput("output")
]), (item) => item["name"]);
new Observer(root, () => console.log("tree changed!"));
document.body.append(root.element);
console.log("root =", globalThis["root"] = root);

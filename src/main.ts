import { App } from "./app/App";
import { render } from "./core/render/render";
import { createElement } from "./core/vdom/createElement";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root container not found");
}

render(createElement(App, null), root);

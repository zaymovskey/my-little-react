import { createHtmlVNode, createTextVNode } from "./core/createElement";
import { render } from "./core/render";

const root = document.getElementById("root")!;

const VDOM = createHtmlVNode("main", {}, [
  createHtmlVNode("h1", {}, [createTextVNode("Hello, world!")]),
  createHtmlVNode("p", {}, [
    createTextVNode("This is a simple React-like library."),
  ]),
]);

render(VDOM, root);

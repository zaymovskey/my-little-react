import { createHtmlVNode, createTextVNode } from "./core/createElement";
import { render } from "./core/render";

const root = document.getElementById("root")!;

const VDOM1 = createHtmlVNode("main", {}, [
  createHtmlVNode("h1", {}, [createTextVNode("Hello, world!")]),
  createHtmlVNode("p", {}, [
    createTextVNode("This is a simple React-like library."),
  ]),
  createHtmlVNode("button", { onClick: () => alert("Button clicked!") }, [
    createTextVNode("Click me"),
  ]),
]);

render(VDOM1, root);

const VDOM2 = createHtmlVNode("main", {}, [
  createHtmlVNode("h1", {}, [createTextVNode("Hello, world! 2")]),
  createHtmlVNode("p", {}, [
    createTextVNode("This is a simple React-like library. 2"),
  ]),
  createHtmlVNode("button", { onClick: () => alert("Button clicked! 2") }, [
    createTextVNode("Click me 2"),
  ]),
]);

setTimeout(() => {
  render(VDOM2, root);
}, 2000);

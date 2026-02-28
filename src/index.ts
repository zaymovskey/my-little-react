import {
  createHtmlVNode,
  createTextVNode,
  createFunctionalComponentVNode,
} from "./core/createElement";
import { render } from "./core/render";

const root = document.getElementById("root")!;

const VDOM1 = createFunctionalComponentVNode((props) => {
  return createHtmlVNode("main", {}, [
    createHtmlVNode("h1", {}, [createTextVNode("Hello, world!")]),
    createHtmlVNode("p", {}, [
      createTextVNode("This is a simple React-like library."),
    ]),
  ]);
});

render(VDOM1, root);
